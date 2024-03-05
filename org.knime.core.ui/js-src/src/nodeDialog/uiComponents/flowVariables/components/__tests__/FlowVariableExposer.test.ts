/* eslint-disable @typescript-eslint/no-unused-vars */
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { mount } from "@vue/test-utils";
import { beforeEach, afterEach, describe, expect, it, vi, Mock } from "vitest";
import flushPromises from "flush-promises";

import FlowVariableExposer from "../FlowVariableExposer.vue";
import type FlowVariableExposerProps from "../../types/FlowVariableExposerProps";
import ErrorMessage from "../../../ErrorMessage.vue";
import { providedKey as providedByComponentKey } from "@/nodeDialog/composables/components/useFlowVariables";
import { injectionKey as dirtySettingInjectionKey } from "@/nodeDialog/composables/components/useDirtySetting";
import { FlowSettings } from "@/nodeDialog/api/types";
import { ref, type Ref } from "vue";

describe("FlowVariableExposer", () => {
  let props: FlowVariableExposerProps,
    flowSettings: Ref<FlowSettings | undefined>,
    flowVariablesMap: Record<string, FlowSettings>,
    setDirtyState: Mock,
    unsetDirtyState: Mock;

  beforeEach(() => {
    flowVariablesMap = {};
    flowSettings = ref(undefined);
    props = {
      persistPath: "persist.path.to.setting",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountFlowVariableExposer = ({
    props,
  }: {
    props: FlowVariableExposerProps;
  }) => {
    setDirtyState = vi.fn();
    unsetDirtyState = vi.fn();
    return mount(FlowVariableExposer as any, {
      props,
      global: {
        provide: {
          [providedByComponentKey]: {
            flowSettings,
          },
          [dirtySettingInjectionKey as symbol]: {
            exposed: {
              get: () => ({
                set: setDirtyState,
                unset: unsetDirtyState,
              }),
            },
          },
          getFlowVariablesMap: () => flowVariablesMap,
        },
      },
    });
  };

  it("renders empty input field", async () => {
    const wrapper = mountFlowVariableExposer({ props });
    expect(wrapper.findComponent(InputField).exists()).toBeTruthy();
    await flushPromises();
    expect(
      wrapper
        .findComponent(InputField)
        .element.attributes.getNamedItem("arialabel")?.textContent,
    ).toBe("outputted-flow-variable-persist.path.to.setting");
    expect(wrapper.findComponent(InputField).props()).toMatchObject({
      modelValue: "",
    });
  });

  it("sets the initial model value", () => {
    const varName = "var";
    flowSettings.value = {
      controllingFlowVariableName: null,
      controllingFlowVariableAvailable: true,
      exposedFlowVariableName: varName,
    };
    const wrapper = mountFlowVariableExposer({ props });
    expect(wrapper.findComponent(InputField).props().modelValue).toBe(varName);
    expect(setDirtyState).not.toHaveBeenCalled();
  });

  it("sets exposed flow variable", async () => {
    const inputValue = "myExposedVar";
    const wrapper = mountFlowVariableExposer({ props });
    await wrapper
      .findComponent(InputField)
      .vm.$emit("update:model-value", inputValue);
    expect(flowVariablesMap[props.persistPath]).toStrictEqual({
      exposedFlowVariableName: inputValue,
    });
    expect(setDirtyState).toHaveBeenCalledWith(inputValue);
  });

  it.each([["", "  "]])(
    "unsets exposed flow variable on blank input",
    async (unsettingFlowVarName) => {
      const exposedFlowVariableName = "exposed";
      flowVariablesMap[props.persistPath] = {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: null,
        exposedFlowVariableName,
      };
      const wrapper = mountFlowVariableExposer({
        props,
      });

      await wrapper
        .findComponent(InputField)
        .vm.$emit("update:model-value", unsettingFlowVarName);
      expect(flowVariablesMap[props.persistPath]).toStrictEqual({
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: null,
        exposedFlowVariableName: null,
      });
      expect(wrapper.findComponent(InputField).props().modelValue).toBe(
        unsettingFlowVarName,
      );
      expect(unsetDirtyState).toHaveBeenCalled();
    },
  );

  it("shows error and invalid state in case of a blank input", async () => {
    const wrapper = mountFlowVariableExposer({ props });
    await wrapper.findComponent(InputField).vm.$emit("update:model-value", " ");
    const errorMessage = wrapper.findComponent(ErrorMessage);
    expect(errorMessage.exists()).toBeTruthy();
    expect(errorMessage.props().errors[0].message).toBe(
      "Flow variable name must not be blank.",
    );
    expect(wrapper.findComponent(InputField).props().isValid).toBe(false);
  });
});
