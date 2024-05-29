import { shallowMount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { injectionKey as providedByComponentKey } from "@/nodeDialog/composables/components/useFlowVariables";
import { type Ref, ref } from "vue";
import { FlowSettings } from "@/nodeDialog/api/types";
import DeprecatedFlowVariables from "../DeprecatedFlowVariables.vue";
import Button from "@@/webapps-common/ui/components/Button.vue";
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
  });

  const mountDeprecatedFlowVariablesComponent = () => {
    return shallowMount(DeprecatedFlowVariables, {
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            dataPaths,
            configPaths,
          },
          [flowVarMapKey as symbol]: flowVariablesMap,
        },
      },
    });
  };

  it("renders DeprecatedFlowVariables component if deprecated flow variables exist", async () => {
    const deprecatedPath = "model.myDeprecatedPath";
    const flowVariableName = "aFlowVariableSetAgesAgo";
    flowVariablesMap = {
      [deprecatedPath]: {
        controllingFlowVariableName: flowVariableName,
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
    const wrapper = mountDeprecatedFlowVariablesComponent();
    expect(wrapper.text()).toContain(
      "The following set flow variables are deprecated:",
    );
    const li = wrapper.find("li");
    expect(li.text()).toContain(deprecatedPath);
    expect(li.find("input").element.value).toStrictEqual(flowVariableName);
    await li.findComponent(Button).trigger("click");
    expect(flowVariablesMap).toStrictEqual({});
  });
});
