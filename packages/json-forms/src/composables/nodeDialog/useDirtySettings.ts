import {
  DialogService,
  type SettingComparator,
  type SettingState,
} from "@knime/ui-extension-service";
import { type InjectionKey, inject, provide } from "vue";

type ControllingVariable = ReturnType<
  SettingState["addControllingFlowVariable"]
>;
type ExposedVariable = ReturnType<SettingState["addExposedFlowVariable"]>;
type SetValue<T> = SettingState<T>["setValue"];

interface FlowVariables<T> {
  get: (persistPath: string) => T | null;
  create: (persistPath: string, flowVarName: string | null) => T;
}

const toFlowVariablesForSettings = <T>(
  createNew: (flowVarName: string | null) => T,
): FlowVariables<T> => {
  const variables: Map<string, T> = new Map();
  return {
    get: (persistPath) => variables.get(persistPath) ?? null,
    create: (persistPath, flowVarName) => {
      const newVar = createNew(flowVarName);
      variables.set(persistPath, newVar);
      return newVar;
    },
  };
};

export interface FlowVariablesForSettings {
  controlling: FlowVariables<ControllingVariable>;
  exposed: FlowVariables<ExposedVariable>;
}

export interface SettingStateWrapper<T = any> {
  setValue: SetValue<T>;
  flowVariables: FlowVariablesForSettings;
}

const wrapSettingState = <T>(
  settingState: SettingState<T>,
): SettingStateWrapper<T> => {
  return {
    flowVariables: {
      controlling: toFlowVariablesForSettings(
        settingState.addControllingFlowVariable,
      ),
      exposed: toFlowVariablesForSettings(settingState.addExposedFlowVariable),
    },
    setValue: settingState.setValue,
  };
};

/**
 * Exported for testing only
 */
export const injectionKey: InjectionKey<{
  getSettingState: <T>(dataPath: string) => SettingStateWrapper<T> | null;
  constructSettingState: <T>(
    dataPath: string,
    params: {
      initialValue: T;
      valueComparator: SettingComparator<T>;
    },
  ) => SettingStateWrapper<T>;
}> = Symbol("providedByUseDirtySettings");

export const provideAndGetSetupMethod = () => {
  const getModelOrView = (persistPath: string) =>
    persistPath.split(".")[0] as "model" | "view";

  /**
   * Maps data path to setting
   */
  const settings: Map<string, SettingStateWrapper> = new Map();

  let _registerSettings: typeof DialogService.prototype.registerSettings;

  const getSettingState = <T>(
    dataPath: string,
  ): SettingStateWrapper<T> | null => {
    return settings.get(dataPath) ?? null;
  };

  const constructSettingState = <T>(
    dataPath: string,
    params: {
      initialValue: T;
      valueComparator: SettingComparator<T>;
    },
  ): SettingStateWrapper<T> => {
    const modelOrView = getModelOrView(dataPath);
    const newSetting = wrapSettingState(_registerSettings(modelOrView)(params));
    settings.set(dataPath, newSetting);
    return newSetting;
  };

  const setRegisterSettingsMethod = (
    registerSettings: typeof DialogService.prototype.registerSettings,
  ) => {
    _registerSettings = registerSettings;
  };

  provide(injectionKey, {
    constructSettingState,
    getSettingState,
  });

  return { setRegisterSettingsMethod };
};

export default () => inject(injectionKey)!;
