import { type InjectionKey, type Ref, computed, inject, provide } from "vue";

import type { FlowSettings } from "../../api/types";
import { injectForFlowVariables } from "../../utils/inject";
import { getConfigPaths } from "../../utils/paths";
import type { SettingStateWrapper } from "../nodeDialog/useDirtySettings";

import { getFlowVariablesMap } from "./useProvidedFlowVariablesMap";

export interface ConfigPath {
  configPath: string;
  dataPath: string;
  deprecatedConfigPaths: string[];
}

export interface FlowVariableSettingsProvidedByControl {
  flowSettings: Ref<FlowSettings | null>;
  configPaths: Ref<ConfigPath[]>;
  settingStateFlowVariables: SettingStateWrapper["flowVariables"];
}

/** Exported only for tests */
export const injectionKey: InjectionKey<FlowVariableSettingsProvidedByControl> =
  Symbol("flowVariableSettingsProvidedByControl");
export const getFlowVariableSettingsProvidedByControl = () =>
  inject(injectionKey)!;

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

const getProvidedSettingStateFlowVariables = (
  {
    settingState,
    isNew,
  }: { settingState: SettingStateWrapper; isNew: boolean },
  configPaths: string[],
  flowVariablesMap: Record<string, FlowSettings>,
) => {
  if (isNew) {
    configPaths?.forEach((persistPath) => {
      const {
        controllingFlowVariableName = null,
        exposedFlowVariableName = null,
      } = flowVariablesMap[persistPath] ?? {};
      settingState.flowVariables.controlling.create(
        persistPath,
        controllingFlowVariableName,
      );
      settingState.flowVariables.exposed.create(
        persistPath,
        exposedFlowVariableName,
      );
    });
  }
  return settingState.flowVariables;
};

export interface UseFlowSettingsProps {
  path: Ref<string>;
  settingState: { settingState: SettingStateWrapper; isNew: boolean };
}

export const useFlowSettings = (
  params: UseFlowSettingsProps,
): {
  flowSettings: Ref<FlowSettings | null>;
  disabledByFlowVariables: Ref<boolean>;
} => {
  const { path, settingState } = params;
  const flowVariablesMap = getFlowVariablesMap();
  const persistSchema = injectForFlowVariables("getPersistSchema")();
  const configPaths = computed(() =>
    getConfigPaths({ persistSchema, path: path.value }),
  );
  const flowSettings = computed(() => {
    return toFlowSetting(flowVariablesMap, configPaths.value);
  });

  const allConfigPaths = configPaths.value.flatMap(
    ({ configPath, deprecatedConfigPaths }) => [
      configPath,
      ...deprecatedConfigPaths,
    ],
  );

  provide(injectionKey, {
    flowSettings,
    configPaths,
    settingStateFlowVariables: getProvidedSettingStateFlowVariables(
      settingState,
      allConfigPaths,
      flowVariablesMap,
    ),
  });

  const hasDeprecatedVariables = computed(
    () =>
      configPaths.value
        .flatMap(({ deprecatedConfigPaths }) => deprecatedConfigPaths)
        .filter(
          (deprecatedConfigPath) => flowVariablesMap[deprecatedConfigPath],
        ).length > 0,
  );

  const disabledByFlowVariables = computed(
    () =>
      Boolean(flowSettings.value?.controllingFlowVariableName) ||
      hasDeprecatedVariables.value,
  );

  return { flowSettings, disabledByFlowVariables };
};
