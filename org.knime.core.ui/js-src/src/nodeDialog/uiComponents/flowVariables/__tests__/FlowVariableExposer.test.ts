/* eslint-disable @typescript-eslint/no-unused-vars */
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { mount } from "@vue/test-utils";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import FlowVariableExposer from "../FlowVariableExposer.vue";
import type FlowVariableExposerProps from "../types/FlowVariableExposerProps";
import ErrorMessage from "../../ErrorMessage.vue";

describe("FlowVariableExposer", () => {
  let props: FlowVariableExposerProps;

  beforeEach(() => {
    props = {
      flowVariablesMap: {},
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
    return mount(FlowVariableExposer as any, {
      props,
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
    props.flowSettings = {
      controllingFlowVariableName: null,
      controllingFlowVariableAvailable: true,
      exposedFlowVariableName: varName,
    };
    const wrapper = mountFlowVariableExposer({ props });
    expect(wrapper.findComponent(InputField).props().modelValue).toBe(varName);
  });

  it("sets exposed flow variable", async () => {
    const inputValue = "myExposedVar";
    const wrapper = mountFlowVariableExposer({ props });
    await wrapper
      .findComponent(InputField)
      .vm.$emit("update:model-value", inputValue);
    expect(props.flowVariablesMap[props.persistPath]).toStrictEqual({
      exposedFlowVariableName: inputValue,
    });
  });

  it.each([["", "  "]])(
    "unsets exposed flow variable on blank input",
    async (unsettingFlowVarName) => {
      const exposedFlowVariableName = "exposed";
      props.flowVariablesMap[props.persistPath] = {
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
      expect(props.flowVariablesMap[props.persistPath]).toStrictEqual({
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: null,
        exposedFlowVariableName: null,
      });
      expect(wrapper.findComponent(InputField).props().modelValue).toBe(
        unsettingFlowVarName,
      );
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
