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
  let configPaths: Ref<string[]>, dataPaths: Ref<string[]>;

  const path = "model.myPath";

  beforeEach(() => {
    configPaths = ref([path]);
    dataPaths = ref(["firstDataPath"]);
  });

  const mountFlowVaiablePopover = () => {
    return shallowMount(FlowVariablePopover, {
      global: {
        provide: {
          [providedByComponentKey]: {
            dataPaths,
            configPaths,
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
    const localConfigPaths = ["firstPath", "secondPath"];
    configPaths.value = localConfigPaths;
    const wrapper = mountFlowVaiablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    localConfigPaths.forEach((key) => expect(wrapper.text()).toContain(key));
  });

  it("sets persist path from single element config paths", () => {
    const wrapper = mountFlowVaiablePopover();
    expect(
      wrapper.findComponent(FlowVariableSelector).props().persistPath,
    ).toBe(path);
  });

  it("sets first data path as path", () => {
    const wrapper = mountFlowVaiablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
      dataPaths.value[0],
    );
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
