import { MaybeRef, Ref, computed, inject, provide, unref } from "vue";
import { getConfigPaths } from "../utils";
import { FlowSettings } from "../api/types";
import { injectForFlowVariables } from "../utils/inject";

interface FlowVariableSettingsProvidedByControl {
  flowSettings: Ref<FlowSettings | null>;
  path: Ref<string>;
  configKeys?: Ref<string[] | undefined>;
  subConfigKeys?: string[];
}

/** Exported only for tests */
export const providedKey = "flowVariableSettingsProvidedByControl";
export const getFlowVariableSettingsProvidedByControl = () =>
  inject<FlowVariableSettingsProvidedByControl>(providedKey)!;

export const getFlowVariablesMap = () =>
  injectForFlowVariables("getFlowVariablesMap")();

const isFlowSettings = (
  flowSettings: FlowSettings | undefined | null,
): flowSettings is FlowSettings => {
  return Boolean(flowSettings);
};

const toFlowSetting = (
  flowVariablesMap: Record<string, FlowSettings>,
  configPaths: string[],
) => {
  const flowSettings = configPaths
    .map((key) => flowVariablesMap[key])
    .filter(isFlowSettings);
  return flowSettings.reduce(
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
  path: MaybeRef<string>;
  configKeys?: MaybeRef<string[] | undefined>;
  subConfigKeys?: string[];
}): Ref<FlowSettings | null> => {
  const { path, configKeys, subConfigKeys } = params;
  const flowVariablesMap = getFlowVariablesMap();
  const flowSettings = computed(() => {
    return toFlowSetting(
      flowVariablesMap,
      getConfigPaths(unref(path), unref(configKeys), subConfigKeys),
    );
  });
  provide(providedKey, {
    flowSettings,
    path,
    configKeys,
    subConfigKeys,
  });
  return flowSettings;
};
