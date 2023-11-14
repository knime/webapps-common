import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Label from "webapps-common/ui/components/forms/Label.vue";
import Fieldset from "webapps-common/ui/components/forms/Fieldset.vue";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import FlowVariableExposer from "../FlowVariableExposer.vue";
import MulitpleConfigKeysNotYetSupported from "../MultipleConfigKeysNotYetSupported.vue";
import type FlowVariablePopoverProps from "../types/FlowVariablePopoverProps";

describe("FlowVariablePopover", () => {
  let props: FlowVariablePopoverProps;

  beforeEach(() => {
    props = {
      flowVariablesMap: {},
      path: "model.myPath",
    };
  });

  const mountFlowVaiablePopover = (options: {
    props: FlowVariablePopoverProps;
  }) => {
    return shallowMount(FlowVariablePopover, {
      ...options,
      global: {
        stubs: { MulitpleConfigKeysNotYetSupported, Label, Fieldset },
      },
    });
  };

  it("renders selector", () => {
    const wrapper = mountFlowVaiablePopover({ props });

    const labelForSelector = wrapper.findComponent(Label);
    const selector = wrapper.findComponent(FlowVariableSelector);
    expect(labelForSelector.text()).toBe("Overwrite with flow variable");
    expect(selector.exists()).toBeTruthy();
    expect(selector.attributes().id).toBe(
      labelForSelector.find("label").attributes().for,
    );

    const labelForExposer = wrapper.findAllComponents(Label).at(1)!;
    const exposer = wrapper.findComponent(FlowVariableExposer);
    expect(labelForExposer.text()).toBe("Output as flow variable");
    expect(exposer.exists()).toBeTruthy();
    expect(exposer.attributes().id).toBe(
      labelForExposer.find("label").attributes().for,
    );
  });

  it("does not render selector in case of multiple config keys", () => {
    props.configKeys = ["myConfigKey1", "myConfigKey2"];
    const wrapper = mountFlowVaiablePopover({ props });
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    props.configKeys.forEach((key) => expect(wrapper.text()).toContain(key));
  });

  it("does not render selector in case of multiple sub config keys", () => {
    props.subConfigKeys = ["myConfigKey1", "myConfigKey2"];
    const wrapper = mountFlowVaiablePopover({ props });
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    props.subConfigKeys.forEach((key) =>
      expect(wrapper.text()).not.toContain(key),
    );
  });

  describe("persist path", () => {
    it("sets persist path from data path if no config keys are given", () => {
      const wrapper = mountFlowVaiablePopover({ props });
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe(props.path);
    });

    it("sets persist path from config key", () => {
      props.configKeys = ["configKey1"];
      const wrapper = mountFlowVaiablePopover({ props });
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe("model.configKey1");
    });

    it("does not add anything if there are no sub config keys", () => {
      props.subConfigKeys = [];
      props.configKeys = ["configKey1"];
      const wrapper = mountFlowVaiablePopover({ props });
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe("model.configKey1");
      expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
        "model.myPath",
      );
    });

    it("adds a single sub config key to persistPath and dataPath", () => {
      props.subConfigKeys = ["subConfigKey"];
      props.configKeys = ["configKey1"];
      const wrapper = mountFlowVaiablePopover({ props });
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe("model.configKey1.subConfigKey");
      expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
        "model.myPath.subConfigKey",
      );
    });
  });

  describe("events", () => {
    it("emits controllingFlowVariableSet", () => {
      const flowVarName = "myFlowVar";
      const wrapper = mountFlowVaiablePopover({ props });
      wrapper
        .findComponent(FlowVariableSelector)
        .vm.$emit("controllingFlowVariableSet", flowVarName);
      expect(wrapper.emitted().controllingFlowVariableSet).toStrictEqual([
        [flowVarName],
      ]);
    });
  });
});
