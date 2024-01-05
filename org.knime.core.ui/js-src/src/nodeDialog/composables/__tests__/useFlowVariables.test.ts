import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlowSettings } from "@/nodeDialog/api/types";
import { mount } from "@vue/test-utils";
import UseFlowVariablesTestComponent from "./UseFlowVariablesTestComponent.vue";
import { providedKey } from "../useFlowVariables";
import Control from "@/nodeDialog/types/Control";
import { Ref, ref } from "vue";

let flowVariablesMap: Record<string, FlowSettings>;

vi.mock("../../utils/inject", () => ({
  injectForFlowVariables: () => () => flowVariablesMap,
}));

type Props = {
  control: Ref<{
    path: string;
    rootSchema: Control["rootSchema"];
  }>;
  subConfigKeys?: string[];
};

describe("useFlowVariables", () => {
  const InjectingSlot = {
    inject: [providedKey],
    template: "<div/>",
  };

  const createControl = ({
    path,
    configKeys,
  }: {
    path: string;
    configKeys?: string[];
  }) => {
    const rootSchema: Control["rootSchema"] = {};
    let schema: any = rootSchema;
    for (const segment of path.split(".")) {
      const nextSchema = {};
      schema.type = "object";
      schema.properties = { [segment]: nextSchema };
      schema = nextSchema;
    }
    if (configKeys) {
      schema.configKeys = configKeys;
    }
    return ref({ path, rootSchema });
  };

  const mountTestComponent = (props: Props) => {
    return mount(UseFlowVariablesTestComponent, {
      props,
      slots: {
        default: InjectingSlot,
      },
      global: {
        provide: {
          getFlowVariablesMap: () => flowVariablesMap,
        },
      },
    });
  };

  it("provides flowSettings, configPaths and dataPaths", () => {
    const path = "path";
    const configKeys = ["configKey"];
    const subConfigKeys = ["subConfigKey"];
    const wrapper = mountTestComponent({
      control: createControl({
        path,
        configKeys,
      }),
      subConfigKeys,
    });
    const provided = wrapper.findComponent(InjectingSlot).vm[providedKey];
    expect(provided.flowSettings).toBeDefined();
    expect(provided.configPaths.value).toEqual(["configKey.subConfigKey"]);
    expect(provided.dataPaths.value).toEqual(["path.subConfigKey"]);
  });

  describe("flow settings", () => {
    const getFlowSettings = (props: Props) => {
      return mountTestComponent(props).vm.flowSettings;
    };

    beforeEach(() => {
      flowVariablesMap = {};
    });

    const createFlowSetting = (
      controllingFlowVariableAvailable: boolean,
      controllingFlowVariableName: string | null,
      exposedFlowVariableName: string | null,
    ): FlowSettings => ({
      controllingFlowVariableAvailable,
      controllingFlowVariableName,
      exposedFlowVariableName,
    });

    const CONTROLLING_FLOW_SETTINGS = createFlowSetting(
      true,
      "my_controlling_variable",
      null,
    );
    const EXPOSING_FLOW_SETTINGS = createFlowSetting(
      false,
      null,
      "my_exposed_variable",
    );
    const NOTHING_FLOW_SETTINGS = createFlowSetting(false, null, null);
    const MERGED_FLOW_SETTINGS = createFlowSetting(
      true,
      "my_controlling_variable",
      "my_exposed_variable",
    );

    it("returns null for an missing flowVariablesMap", () => {
      expect(
        getFlowSettings({ control: createControl({ path: "otherPath" }) }),
      ).toBeNull();
    });

    it("returns undefined for missing flow setting for path", () => {
      flowVariablesMap = {
        "path.to.my_setting": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          control: createControl({ path: "path.to.another_setting" }),
        }),
      ).toBeNull();

      expect(
        getFlowSettings({
          control: createControl({
            path: "path.to.another_setting",
            configKeys: ["also_another_setting"],
          }),
        }),
      ).toBeNull();
    });

    it("uses path if configKeys is undefined", () => {
      const path = "path.to.my_setting";
      flowVariablesMap = { [path]: CONTROLLING_FLOW_SETTINGS };
      expect(getFlowSettings({ control: createControl({ path }) })).toEqual(
        CONTROLLING_FLOW_SETTINGS,
      );
    });

    it("uses configKeys", () => {
      flowVariablesMap = {
        "path.to.my_real_setting_name": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          control: createControl({
            path: "path.to.my_setting",
            configKeys: ["my_real_setting_name"],
          }),
        }),
      ).toEqual(CONTROLLING_FLOW_SETTINGS);
    });

    it("merges flow settings for configKeys", () => {
      flowVariablesMap = {
        "path.to.setting_1": EXPOSING_FLOW_SETTINGS,
        "path.to.setting_2": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          control: createControl({
            path: "path.to.my_setting",
            configKeys: ["setting_1", "setting_2", "not_overwritten_setting"],
          }),
        }),
      ).toEqual(MERGED_FLOW_SETTINGS);

      flowVariablesMap = {
        "path.to.setting_1": NOTHING_FLOW_SETTINGS,
        "path.to.setting_2": CONTROLLING_FLOW_SETTINGS,
        "path.to.setting_3": EXPOSING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          control: createControl({
            path: "path.to.my_setting",
            configKeys: [
              "setting_1",
              "setting_2",
              "setting_3",
              "not_overwritten_setting",
            ],
          }),
        }),
      ).toEqual(MERGED_FLOW_SETTINGS);
    });
  });
});
