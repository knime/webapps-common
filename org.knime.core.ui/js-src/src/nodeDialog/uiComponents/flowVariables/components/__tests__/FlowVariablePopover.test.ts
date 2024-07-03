import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import Label from "webapps-common/ui/components/forms/Label.vue";
import Fieldset from "webapps-common/ui/components/forms/Fieldset.vue";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import FlowVariableExposer from "../FlowVariableExposer.vue";
import MultipleConfigKeysNotYetSupported from "../MultipleConfigKeysNotYetSupported.vue";
import { injectionKey as providedByComponentKey } from "@/nodeDialog/composables/components/useFlowVariables";
import { type Ref, ref } from "vue";
import { FlowSettings } from "@/nodeDialog/api/types";
import DeprecatedFlowVariables from "../DeprecatedFlowVariables.vue";
import { injectionKey as flowVarMapKey } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";

describe("FlowVariablePopover", () => {
  let configPaths: Ref<
      { configPath: string; deprecatedConfigPaths: string[] }[]
    >,
    dataPaths: Ref<string[]>,
    flowVariablesMap: Record<string, FlowSettings>;

  const path = "model.myPath";

  beforeEach(() => {
    flowVariablesMap = {};
    configPaths = ref([{ configPath: path, deprecatedConfigPaths: [] }]);
    dataPaths = ref(["firstDataPath"]);
  });

  const mountFlowVariablePopover = () => {
    return shallowMount(FlowVariablePopover, {
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            dataPaths,
            configPaths,
          },
          [flowVarMapKey as symbol]: flowVariablesMap,
        },
        stubs: { MultipleConfigKeysNotYetSupported, Label, Fieldset },
      },
    });
  };

  it("renders selector", () => {
    const wrapper = mountFlowVariablePopover();

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
    expect(wrapper.findComponent(DeprecatedFlowVariables).exists()).toBe(false);
  });

  it("does not render selector in case of multiple config keys", () => {
    const localConfigPaths = ["firstPath", "secondPath"];
    configPaths.value = localConfigPaths.map((configPath) => ({
      configPath,
      deprecatedConfigPaths: [],
    }));
    const wrapper = mountFlowVariablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(MultipleConfigKeysNotYetSupported).exists(),
    ).toBeTruthy();
    localConfigPaths.forEach((key) => expect(wrapper.text()).toContain(key));
  });

  it("sets persist path from single element config paths", () => {
    const wrapper = mountFlowVariablePopover();
    expect(
      wrapper.findComponent(FlowVariableSelector).props().persistPath,
    ).toBe(path);
  });

  it("sets first data path as path", () => {
    const wrapper = mountFlowVariablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
      dataPaths.value[0],
    );
  });

  describe("events", () => {
    it("emits controllingFlowVariableSet", () => {
      const flowVarName = "myFlowVar";
      const wrapper = mountFlowVariablePopover();
      wrapper
        .findComponent(FlowVariableSelector)
        .vm.$emit("controllingFlowVariableSet", flowVarName);
      expect(wrapper.emitted().controllingFlowVariableSet).toStrictEqual([
        [flowVarName],
      ]);
    });
  });

  it("renders DeprecatedFlowVariables component if deprecated flow variables exist", () => {
    const deprecatedPath = "model.myDeprecatedPath";
    flowVariablesMap = {
      [deprecatedPath]: {
        controllingFlowVariableName: "aFlowVariableSetAgesAgo",
        controllingFlowVariableAvailable: true,
        exposedFlowVariableName: null,
      },
    };
    configPaths.value = [
      {
        configPath: path,
        deprecatedConfigPaths: [deprecatedPath, "some other deprecated path"],
      },
    ];
    const wrapper = mountFlowVariablePopover();
    expect(
      wrapper.findComponent(DeprecatedFlowVariables).exists(),
    ).toBeTruthy();
  });
});
