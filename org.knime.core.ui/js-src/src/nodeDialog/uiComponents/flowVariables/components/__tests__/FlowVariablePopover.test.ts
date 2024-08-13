import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { Label, Fieldset } from "@knime/components";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import FlowVariableExposer from "../FlowVariableExposer.vue";
import DifferingNumbersOfConfigAndDataKeys from "../DifferingNumbersOfConfigAndDataKeys.vue";
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
        stubs: { DifferingNumbersOfConfigAndDataKeys, Label, Fieldset },
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

  it("renders selector in case of multiple config keys with single data keys", () => {
    const localConfigPaths = ["firstConfigPath", "secondConfigPath"];
    configPaths.value = localConfigPaths.map((configPath) => ({
      configPath,
      deprecatedConfigPaths: [],
    }));
    dataPaths.value = ["firstDataPath"];
    const wrapper = mountFlowVariablePopover();

    for (let i = 0; i < localConfigPaths.length; i++) {
      const labelForSelector = wrapper.findAllComponents(Label).at(i * 2);
      const selector = wrapper.findAllComponents(FlowVariableSelector).at(i);
      expect(labelForSelector?.text()).toBe(
        "Overwrite ".concat(localConfigPaths[i]),
      );
      expect(selector?.exists()).toBeTruthy();
      expect(selector?.attributes().id).toBe(
        labelForSelector?.find("label").attributes().for,
      );

      const labelForExposer = wrapper.findAllComponents(Label).at(i * 2 + 1)!;
      const exposer = wrapper.findAllComponents(FlowVariableExposer).at(i);
      expect(labelForExposer.text()).toBe(
        "Output ".concat(localConfigPaths[i]),
      );
      expect(exposer?.exists()).toBeTruthy();
      expect(exposer?.attributes().id).toBe(
        labelForExposer.find("label").attributes().for,
      );
    }
  });

  it("renders selector in case of multiple config keys with corresponding data keys", () => {
    const localConfigPaths = ["firstConfigPath", "secondConfigPath"];
    configPaths.value = localConfigPaths.map((configPath) => ({
      configPath,
      deprecatedConfigPaths: [],
    }));
    dataPaths.value = ["firstDataPath", "secondDataPath"];
    const wrapper = mountFlowVariablePopover();

    for (let i = 0; i < localConfigPaths.length; i++) {
      const labelForSelector = wrapper.findAllComponents(Label).at(i * 2);
      const selector = wrapper.findAllComponents(FlowVariableSelector).at(i);
      expect(labelForSelector?.text()).toBe(
        "Overwrite ".concat(localConfigPaths[i]),
      );
      expect(selector?.exists()).toBeTruthy();
      expect(selector?.attributes().id).toBe(
        labelForSelector?.find("label").attributes().for,
      );

      const labelForExposer = wrapper.findAllComponents(Label).at(i * 2 + 1)!;
      const exposer = wrapper.findAllComponents(FlowVariableExposer).at(i);
      expect(labelForExposer.text()).toBe(
        "Output ".concat(localConfigPaths[i]),
      );
      expect(exposer?.exists()).toBeTruthy();
      expect(exposer?.attributes().id).toBe(
        labelForExposer.find("label").attributes().for,
      );
    }
  });

  it("does not render selector in case of multiple config and data keys", () => {
    const localConfigPaths = ["firstPath", "secondPath"];
    configPaths.value = localConfigPaths.map((configPath) => ({
      configPath,
      deprecatedConfigPaths: [],
    }));
    dataPaths.value = ["firstPath", "secondPath", "thirdPath"];
    const wrapper = mountFlowVariablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).exists()).toBeFalsy();
    expect(
      wrapper.findComponent(DifferingNumbersOfConfigAndDataKeys).exists(),
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
