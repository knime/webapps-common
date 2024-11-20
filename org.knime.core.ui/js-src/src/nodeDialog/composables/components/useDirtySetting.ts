import { type Ref, onUnmounted, watch } from "vue";

import type { SettingComparator } from "@knime/ui-extension-service";

import useDirtySettings from "../nodeDialog/useDirtySettings";

import {
  JsonSettingsComparator,
  type Stringifyable,
} from "./JsonSettingsComparator";
import { injectIsChildOfAddedArrayLayoutElement } from "./useAddedArrayLayoutItem";

export const useDirtySetting = <ValueType extends Stringifyable>({
  dataPath,
  value,
  valueComparator: valueComparatorProp,
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
  const constructNewSettingState = () => {
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
    return settingState;
  };

  const getExistingSettingStateAndSetCurrentValue = () => {
    const settingState = getSettingState<ValueType | undefined>(dataPath);
    settingState?.setValue(initialValue);
    return settingState;
  };

  const getOrConstructSettingState = () => {
    const existing = getExistingSettingStateAndSetCurrentValue();
    if (existing === null) {
      const newSettingState = constructNewSettingState();
      return { isNew: true, settingState: newSettingState };
    } else {
      return { isNew: false, settingState: existing };
    }
  };

  const { settingState, isNew } = getOrConstructSettingState();

  watch(
    () => value.value,
    (newValue) => settingState.setValue(newValue),
  );
  onUnmounted(() => {
    // eslint-disable-next-line no-undefined
    settingState.setValue(undefined);
  });

  return { settingState, isNew };
};
