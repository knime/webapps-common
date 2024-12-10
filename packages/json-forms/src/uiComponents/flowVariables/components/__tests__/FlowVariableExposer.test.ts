/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { InputField } from "@knime/components";

import { type FlowSettings } from "../../../../api/types";
import { injectionKey as providedByComponentKey } from "../../../../composables/components/useFlowVariables";
import { injectionKey as flowVarMapKey } from "../../../../composables/components/useProvidedFlowVariablesMap";
import ErrorMessage from "../../../ErrorMessage.vue";
import type { FlowVariableSelectorProps } from "../../types/FlowVariableExposerProps";
import FlowVariableExposer from "../FlowVariableExposer.vue";

describe("FlowVariableExposer", () => {
  let props: FlowVariableSelectorProps,
    flowVariablesMap: Record<string, FlowSettings>,
    setDirtyState: Mock,
    unsetDirtyState: Mock;

  beforeEach(() => {
    flowVariablesMap = {};
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
    props: FlowVariableSelectorProps;
  }) => {
    setDirtyState = vi.fn();
    unsetDirtyState = vi.fn();
    return mount(FlowVariableExposer as any, {
      props,
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            settingStateFlowVariables: {
              exposed: {
                get: () => ({
                  set: setDirtyState,
                  unset: unsetDirtyState,
                }),
              },
            },
          },
          [flowVarMapKey as symbol]: flowVariablesMap,
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
    flowVariablesMap[props.persistPath] = {
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
    expect(errorMessage.props().errors![0].message).toBe(
      "Flow variable name must not be blank.",
    );
    expect(wrapper.findComponent(InputField).props().isValid).toBe(false);
  });
});
