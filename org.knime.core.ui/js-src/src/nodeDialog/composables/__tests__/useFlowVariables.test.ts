import { beforeEach, describe, expect, it, vi } from "vitest";
import { FlowSettings } from "@/nodeDialog/api/types";
import { mount } from "@vue/test-utils";
import UseFlowVariablesTestComponent from "./UseFlowVariablesTestComponent.vue";
import { providedKey } from "../useFlowVariables";

let flowVariablesMap: Record<string, FlowSettings>;

vi.mock("../../utils/inject", () => ({
  injectForFlowVariables: () => () => flowVariablesMap,
}));

type Props = {
  path: string;
  configKeys?: string[];
  subConfigKeys?: string[];
};

describe("useFlowVariables", () => {
  const InjectingSlot = {
    inject: [providedKey],
    template: "<div/>",
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

  it("provides flowSettings, path and config keys", () => {
    const path = "path";
    const configKeys = ["configKey"];
    const subConfigKeys = ["subConfigKey"];
    const props = { path, configKeys, subConfigKeys };
    const wrapper = mountTestComponent(props);
    expect(wrapper.findComponent(InjectingSlot).vm[providedKey]).toEqual({
      flowSettings: expect.anything(),
      ...props,
    });
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
      expect(getFlowSettings({ path: "" })).toBeNull();
    });

    it("returns undefined for missing flow setting for path", () => {
      flowVariablesMap = {
        "path.to.my_setting": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          path: "path.to.another_setting",
        }),
      ).toBeNull();

      expect(
        getFlowSettings({
          path: "path.to.another_setting",
          configKeys: ["also_another_setting"],
        }),
      ).toBeNull();
    });

    it("uses path if configKeys is undefined", () => {
      const path = "path.to.my_setting";
      flowVariablesMap = { [path]: CONTROLLING_FLOW_SETTINGS };
      expect(getFlowSettings({ path })).toEqual(CONTROLLING_FLOW_SETTINGS);
    });

    it("uses configKeys", () => {
      flowVariablesMap = {
        "path.to.my_real_setting_name": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          path: "path.to.my_setting",
          configKeys: ["my_real_setting_name"],
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
          path: "path.to.my_setting",
          configKeys: ["setting_1", "setting_2", "not_overwritten_setting"],
        }),
      ).toEqual(MERGED_FLOW_SETTINGS);

      flowVariablesMap = {
        "path.to.setting_1": NOTHING_FLOW_SETTINGS,
        "path.to.setting_2": CONTROLLING_FLOW_SETTINGS,
        "path.to.setting_3": EXPOSING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings({
          path: "path.to.my_setting",
          configKeys: [
            "setting_1",
            "setting_2",
            "setting_3",
            "not_overwritten_setting",
          ],
        }),
      ).toEqual(MERGED_FLOW_SETTINGS);
    });
  });
});
