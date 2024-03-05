import { InjectionKey, Ref, inject, onUnmounted, provide, watch } from "vue";
import { getFlowVariablesMap } from "./useFlowVariables";
import { SettingComparator } from "@knime/ui-extension-service";
import {
  JsonSettingsComparator,
  Stringifyable,
} from "./JsonSettingsComparator";
import useDirtySettings, {
  FlowVariablesForSettings,
  SettingStateWrapper,
} from "../nodeDialog/useDirtySettings";
import { injectIsChildOfAddedArrayLayoutElement } from "./useAddedArrayLayoutItem";

/**
 * Export only for testing
 */
export const injectionKey: InjectionKey<FlowVariablesForSettings> = Symbol(
  "providedByUseDirtySetting",
);

const provideFlowVariables = (settingState: SettingStateWrapper) => {
  provide(injectionKey, settingState.flowVariables);
};
export const useDirtyFlowVariables = () => inject(injectionKey)!;

export const useDirtySetting = <ValueType extends Stringifyable>({
  dataPath,
  value,
  valueComparator: valueComparatorProp,
  configPaths,
}: {
  dataPath: string;
  value: Ref<ValueType>;
  valueComparator?: SettingComparator<ValueType | undefined>;
  configPaths?: string[];
}) => {
  const valueComparator = valueComparatorProp ?? new JsonSettingsComparator();
  const { constructSettingState, getSettingState } = useDirtySettings();

  const initialValueShouldBeUndefined =
    injectIsChildOfAddedArrayLayoutElement();
  const initialValue = value.value;
  const constructNewSettingAndAddInitialVariables = () => {
    const settingState = constructSettingState<ValueType | undefined>(
      dataPath,
      {
        // eslint-disable-next-line no-undefined
        initialValue: initialValueShouldBeUndefined ? undefined : initialValue,
        valueComparator,
      },
    );
    if (initialValueShouldBeUndefined) {
      settingState.setValue(initialValue);
    }

    const flowVariablesMap = getFlowVariablesMap();
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
    return settingState;
  };

  const getExistingSettingStateAndSetCurrentValue = () => {
    const settingState = getSettingState<ValueType | undefined>(dataPath);
    settingState?.setValue(initialValue);
    return settingState;
  };

  const settingState =
    getExistingSettingStateAndSetCurrentValue() ??
    constructNewSettingAndAddInitialVariables();
  provideFlowVariables(settingState);

  watch(() => value.value, (newValue) => settingState.setValue(newValue));
  onUnmounted(() => {
    // eslint-disable-next-line no-undefined
    settingState.setValue(undefined);
  });
};
