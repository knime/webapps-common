import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, ref } from "vue";
import { mount } from "@vue/test-utils";

import { createPersistSchema } from "@@/test-setup/utils/createPersistSchema";
import type { SettingStateWrapper } from "../../nodeDialog/useDirtySettings";
import { getFlowVariableSettingsProvidedByControl } from "../useFlowVariables";

import type { FlowSettings } from "./../../../api/types";
import { injectionKey as flowVarMapKey } from "./../../../composables/components/useProvidedFlowVariablesMap";
import type { PersistSchema } from "./../../../types/Persist";
import UseFlowVariablesTestComponent from "./UseFlowVariablesTestComponent.vue";

let flowVariablesMap: Record<string, FlowSettings>;

vi.mock("../../utils/inject", () => ({
  injectForFlowVariables: () => () => flowVariablesMap,
}));

type Props = {
  path: string;
  persistSchema: PersistSchema;
  isNew?: boolean;
};

describe("useFlowVariables", () => {
  const InjectingSlot = defineComponent({
    setup: () => {
      const flowVariableSettings = getFlowVariableSettingsProvidedByControl();
      return { flowVariableSettings };
    },
    render: () => "<div/>",
  });

  let mockedFlowVariableStates: SettingStateWrapper["flowVariables"];

  beforeEach(() => {
    flowVariablesMap = {};
    mockedFlowVariableStates = {
      controlling: {
        create: vi.fn(),
        get: vi.fn(() => null),
      },
      exposed: {
        create: vi.fn(),
        get: vi.fn(() => null),
      },
    };
  });

  const createProps = (params: {
    path: string;
    configPaths?: string[][];
    configKey?: string;
    leaf?: PersistSchema;
  }): Props => {
    return { path: params.path, persistSchema: createPersistSchema(params) };
  };

  const mountTestComponent = (props: Props) => {
    return mount(UseFlowVariablesTestComponent, {
      props: {
        path: ref(props.path),
        settingState: {
          isNew: props.isNew ?? false,
          settingState: {
            setValue: vi.fn(),
            flowVariables: mockedFlowVariableStates,
          },
        },
      },
      slots: {
        default: InjectingSlot,
      },
      global: {
        provide: {
          [flowVarMapKey as symbol]: flowVariablesMap,
          getPersistSchema: () => props.persistSchema,
        },
      },
    });
  };

  const singlePathTestComponentConfigPath = "configKey.subConfigKey";
  const singlePathTestComponentDataPath = "path.subConfigKey";

  const mountSinglePathTestComponent = (params?: { isNew: boolean }) => {
    const path = "path";
    const configKey = "configKey";
    const subConfigKey = "subConfigKey";
    const leaf: PersistSchema = {
      type: "object",
      properties: {
        [subConfigKey]: {},
      },
    };
    return mountTestComponent({
      ...createProps({
        path,
        configKey,
        leaf,
      }),
      ...params,
    });
  };

  it("provides flowSettings, configPaths, dataPaths and settingStateFlowVariables", () => {
    const wrapper = mountSinglePathTestComponent();
    const provided =
      wrapper.findComponent(InjectingSlot).vm.flowVariableSettings;
    expect(provided.flowSettings).toBeDefined();
    expect(provided.configPaths.value).toEqual([
      {
        configPath: singlePathTestComponentConfigPath,
        dataPath: singlePathTestComponentDataPath,
        deprecatedConfigPaths: [],
      },
    ]);
    expect(provided.settingStateFlowVariables).toStrictEqual(
      mockedFlowVariableStates,
    );
  });

  it("does not creates new flow variable states on existing setting state", () => {
    mountSinglePathTestComponent({ isNew: false });
    expect(mockedFlowVariableStates.controlling.create).not.toHaveBeenCalled();
    expect(mockedFlowVariableStates.exposed.create).not.toHaveBeenCalled();
  });

  it("creates new flow variable states on new setting state", () => {
    mountSinglePathTestComponent({ isNew: true });
    expect(mockedFlowVariableStates.controlling.create).toHaveBeenCalledWith(
      singlePathTestComponentConfigPath,
      null,
    );
    expect(mockedFlowVariableStates.exposed.create).toHaveBeenCalledWith(
      singlePathTestComponentConfigPath,
      null,
    );
  });

  it("creates new flow variable states from flowVariablesMap on new setting state", () => {
    const flowSettings = {
      controllingFlowVariableName: "controlling",
      exposedFlowVariableName: "exposed",
      controllingFlowVariableAvailable: true,
    };
    flowVariablesMap = {
      [singlePathTestComponentConfigPath]: flowSettings,
    };
    mountSinglePathTestComponent({ isNew: true });
    expect(mockedFlowVariableStates.controlling.create).toHaveBeenCalledWith(
      singlePathTestComponentConfigPath,
      flowSettings.controllingFlowVariableName,
    );
    expect(mockedFlowVariableStates.exposed.create).toHaveBeenCalledWith(
      singlePathTestComponentConfigPath,
      flowSettings.exposedFlowVariableName,
    );
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
      expect(getFlowSettings(createProps({ path: "otherPath" }))).toBeNull();
    });

    it("returns undefined for missing flow setting for path", () => {
      flowVariablesMap = {
        "path.to.my_setting": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings(
          createProps({
            path: "path.to.another_setting",
          }),
        ),
      ).toBeNull();

      expect(
        getFlowSettings(
          createProps({
            path: "path.to.another_setting",
            configPaths: [["also_another_setting"]],
          }),
        ),
      ).toBeNull();
    });

    it("uses path if configPaths is undefined", () => {
      const path = "path.to.my_setting";
      flowVariablesMap = { [path]: CONTROLLING_FLOW_SETTINGS };
      expect(getFlowSettings(createProps({ path }))).toEqual(
        CONTROLLING_FLOW_SETTINGS,
      );
    });

    it("uses configPaths", () => {
      flowVariablesMap = {
        "path.to.my_real_setting_name": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings(
          createProps({
            path: "path.to.my_setting",
            configPaths: [["my_real_setting_name"]],
          }),
        ),
      ).toEqual(CONTROLLING_FLOW_SETTINGS);
    });

    it("merges flow settings for configPaths", () => {
      flowVariablesMap = {
        "path.to.setting_1": EXPOSING_FLOW_SETTINGS,
        "path.to.setting_2": CONTROLLING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings(
          createProps({
            path: "path.to.my_setting",
            configPaths: [
              ["setting_1"],
              ["setting_2"],
              ["not_overwritten_setting"],
            ],
          }),
        ),
      ).toEqual(MERGED_FLOW_SETTINGS);

      flowVariablesMap = {
        "path.to.setting_1": NOTHING_FLOW_SETTINGS,
        "path.to.setting_2": CONTROLLING_FLOW_SETTINGS,
        "path.to.setting_3": EXPOSING_FLOW_SETTINGS,
      };
      expect(
        getFlowSettings(
          createProps({
            path: "path.to.my_setting",
            configPaths: [
              ["setting_1"],
              ["setting_2"],
              ["setting_3"],
              ["not_overwritten_setting"],
            ],
          }),
        ),
      ).toEqual(MERGED_FLOW_SETTINGS);
    });
  });
});
