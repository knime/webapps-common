import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Label from "webapps-common/ui/components/forms/Label.vue";
import Fieldset from "webapps-common/ui/components/forms/Fieldset.vue";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import FlowVariableExposer from "../FlowVariableExposer.vue";
import MulitpleConfigKeysNotYetSupported from "../MultipleConfigKeysNotYetSupported.vue";
import { providedKey as providedByComponentKey } from "@/nodeDialog/composables/useFlowVariables";
import { type Ref, ref } from "vue";

describe("FlowVariablePopover", () => {
  let subConfigKeys: string[] | undefined,
    configKeys: Ref<string[] | undefined>;

  beforeEach(() => {
    subConfigKeys = undefined;
    configKeys = ref(undefined);
  });

  const path = ref("model.myPath");

  const mountFlowVaiablePopover = () => {
    return shallowMount(FlowVariablePopover, {
      global: {
        provide: {
          [providedByComponentKey]: {
            path,
            configKeys,
            subConfigKeys,
          },
        },
        stubs: { MulitpleConfigKeysNotYetSupported, Label, Fieldset },
      },
    });
  };

  it("renders selector", () => {
    const wrapper = mountFlowVaiablePopover();

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
    const localConfigKeys = ["myConfigKey1", "myConfigKey2"];
    configKeys.value = localConfigKeys;
    const wrapper = mountFlowVaiablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    localConfigKeys.forEach((key) => expect(wrapper.text()).toContain(key));
  });

  it("does not render selector in case of multiple sub config keys", () => {
    subConfigKeys = ["myConfigKey1", "myConfigKey2"];
    const wrapper = mountFlowVaiablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    subConfigKeys.forEach((key) => expect(wrapper.text()).not.toContain(key));
  });

  describe("persist path", () => {
    it("sets persist path from data path if no config keys are given", () => {
      const wrapper = mountFlowVaiablePopover();
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe(path.value);
    });

    it("sets persist path from config key", () => {
      configKeys.value = ["configKey1"];
      const wrapper = mountFlowVaiablePopover();
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe("model.configKey1");
    });

    it("does not add anything if there are no sub config keys", () => {
      subConfigKeys = [];
      configKeys.value = ["configKey1"];
      const wrapper = mountFlowVaiablePopover();
      expect(
        wrapper.findComponent(FlowVariableSelector).props().persistPath,
      ).toBe("model.configKey1");
      expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
        "model.myPath",
      );
    });

    it("adds a single sub config key to persistPath and dataPath", () => {
      subConfigKeys = ["subConfigKey"];
      configKeys.value = ["configKey1"];
      const wrapper = mountFlowVaiablePopover();
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
      const wrapper = mountFlowVaiablePopover();
      wrapper
        .findComponent(FlowVariableSelector)
        .vm.$emit("controllingFlowVariableSet", flowVarName);
      expect(wrapper.emitted().controllingFlowVariableSet).toStrictEqual([
        [flowVarName],
      ]);
    });
  });
});
