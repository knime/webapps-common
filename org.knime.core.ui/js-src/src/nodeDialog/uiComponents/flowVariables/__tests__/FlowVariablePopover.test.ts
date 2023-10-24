import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import type FlowVariableSelectorProps from "../types/FlowVariableSelectorProps";

describe("FlowVariablePopover", () => {
  let props: FlowVariableSelectorProps;

  beforeEach(() => {
    props = {
      flowVariablesMap: {},
      path: "model.myPath",
    };
  });

  it("renders", () => {
    const wrapper = shallowMount(FlowVariablePopover, { props });
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeTruthy();
  });

  describe("events", () => {
    it("emits controllingFlowVariableSet", () => {
      const flowVarName = "myFlowVar";
      const wrapper = shallowMount(FlowVariablePopover, { props });
      wrapper
        .findComponent(FlowVariableSelector)
        .vm.$emit("controllingFlowVariableSet", flowVarName);
      expect(wrapper.emitted().controllingFlowVariableSet).toStrictEqual([
        [flowVarName],
      ]);
    });
  });
});
