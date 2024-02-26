import { Ref, computed, inject, provide } from "vue";
import { getConfigPaths, getDataPaths } from "@/nodeDialog/utils/paths";
import { FlowSettings } from "@/nodeDialog/api/types";
import { injectForFlowVariables } from "@/nodeDialog/utils/inject";
import Control from "@/nodeDialog/types/Control";

export interface FlowVariableSettingsProvidedByControl {
  flowSettings: Ref<FlowSettings | null>;
  dataPaths: Ref<string[]>;
  configPaths: Ref<
    {
      configPath: string;
      deprecatedConfigPaths: string[];
    }[]
  >;
}

/** Exported only for tests */
export const providedKey = "flowVariableSettingsProvidedByControl";
export const getFlowVariableSettingsProvidedByControl = () =>
  inject<FlowVariableSettingsProvidedByControl>(providedKey)!;

export const getFlowVariablesMap = () =>
  injectForFlowVariables("getFlowVariablesMap")();

const getFlowSettingsFromMap =
  (flowVariablesMap: Record<string, FlowSettings>) =>
  (configPaths: string[]) => {
    return configPaths.map((key) => flowVariablesMap[key]).filter(Boolean);
  };

const toFlowSetting = (
  flowVariablesMap: Record<string, FlowSettings>,
  configPaths: {
    configPath: string;
    deprecatedConfigPaths: string[];
  }[],
) => {
  const getFlowSettings = getFlowSettingsFromMap(flowVariablesMap);
  const deprecatedFlowSettings = getFlowSettings(
    configPaths.flatMap(({ deprecatedConfigPaths }) => deprecatedConfigPaths),
  );
  const flowSettings = getFlowSettings(
    configPaths.map(({ configPath }) => configPath),
  );

  return [...deprecatedFlowSettings, ...flowSettings].reduce(
    (a, b) => {
      return {
        controllingFlowVariableAvailable:
          a?.controllingFlowVariableAvailable || // NOSONAR
          b?.controllingFlowVariableAvailable,
        controllingFlowVariableName: a?.controllingFlowVariableName
          ? a?.controllingFlowVariableName
          : b?.controllingFlowVariableName,
        exposedFlowVariableName: a?.exposedFlowVariableName
          ? a?.exposedFlowVariableName
          : b?.exposedFlowVariableName,
      };
    },
    null as FlowSettings | null,
  );
};

export const useFlowSettings = (params: {
  control: Ref<Control>;
  subConfigKeys?: string[];
}): Ref<FlowSettings | null> => {
  const { control, subConfigKeys } = params;
  const flowVariablesMap = getFlowVariablesMap();
  const path = computed(() => control.value.path);
  const configPaths = computed(() =>
    getConfigPaths({ control: control.value, path: path.value, subConfigKeys }),
  );
  const flowSettings = computed(() => {
    return toFlowSetting(flowVariablesMap, configPaths.value);
  });
  provide(providedKey, {
    flowSettings,
    dataPaths: computed(() =>
      getDataPaths({ path: path.value, subConfigKeys }),
    ),
    configPaths,
  } satisfies FlowVariableSettingsProvidedByControl);
  return flowSettings;
};
