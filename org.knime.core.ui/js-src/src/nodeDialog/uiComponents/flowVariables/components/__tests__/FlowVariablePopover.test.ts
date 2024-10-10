import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { Label, Fieldset } from "@knime/components";
import FlowVariablePopover from "../FlowVariablePopover.vue";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import FlowVariableExposer from "../FlowVariableExposer.vue";
import {
  type ConfigPath,
  injectionKey as providedByComponentKey,
} from "@/nodeDialog/composables/components/useFlowVariables";
import { type Ref, ref } from "vue";
import { FlowSettings } from "@/nodeDialog/api/types";
import DeprecatedFlowVariables from "../DeprecatedFlowVariables.vue";
import { injectionKey as flowVarMapKey } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";

describe("FlowVariablePopover", () => {
  let configPaths: Ref<ConfigPath[]>,
    flowVariablesMap: Record<string, FlowSettings>;

  const path = "model.myPath";

  beforeEach(() => {
    flowVariablesMap = {};
    configPaths = ref([
      {
        configPath: path,
        dataPath: "firstDataPath",
        deprecatedConfigPaths: [],
      },
    ]);
  });

  const mountFlowVariablePopover = () => {
    return shallowMount(FlowVariablePopover, {
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            configPaths,
          },
          [flowVarMapKey as symbol]: flowVariablesMap,
        },
        stubs: { Label, Fieldset },
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
      dataPath: "firstDataPath",
    }));
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
    const localDataPaths = ["firstDataPath", "secondDataPath"];
    configPaths.value = localConfigPaths.map((configPath, i) => ({
      configPath,
      dataPath: localDataPaths[i],
      deprecatedConfigPaths: [],
    }));
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

  it("sets persist path from single element config paths", () => {
    const wrapper = mountFlowVariablePopover();
    expect(
      wrapper.findComponent(FlowVariableSelector).props().persistPath,
    ).toBe(path);
  });

  it("sets first data path as path", () => {
    const wrapper = mountFlowVariablePopover();
    expect(wrapper.findComponent(FlowVariableSelector).props().dataPath).toBe(
      configPaths.value[0].dataPath,
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
        dataPath: "dataPath",
        deprecatedConfigPaths: [deprecatedPath, "some other deprecated path"],
      },
    ];
    const wrapper = mountFlowVariablePopover();
    expect(
      wrapper.findComponent(DeprecatedFlowVariables).exists(),
    ).toBeTruthy();
  });
});
