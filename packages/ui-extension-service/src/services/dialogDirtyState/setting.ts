/* eslint-disable class-methods-use-this */
import type { ApplyState, ViewState } from "@knime/ui-extension-renderer/api";

import { useDirtyStates } from ".";
import {
  DefaultSettingComparator,
  type SettingComparator,
} from "./SettingComparator";
import {
  useControllingFlowVariables,
  useExposedFlowVariables,
} from "./flowVariables";

class EqualsSettingsComparator<T> extends DefaultSettingComparator<T, T> {
  toInternalState(cleanSettings: T): T {
    return cleanSettings;
  }

  equals(newState: T, cleanState: T): boolean {
    return newState === cleanState;
  }
}

/**
 * For handling the dirty state of the settings value
 */
const useSettingsValue = <T>(
  value: {
    initialValue: T;
    valueComparator?: SettingComparator<T>;
  },
  onChange: () => void,
) => {
  const valueComparator =
    value.valueComparator ?? new EqualsSettingsComparator<T>();
  valueComparator.setSettings(value.initialValue);
  let currentValue: T = value.initialValue;
  let isModified = false;

  const set = (value: T) => {
    currentValue = value;
    isModified = valueComparator.isModified(currentValue);
    onChange();
  };
  const onApply = () => {
    valueComparator.setSettings(currentValue);
    isModified = false;
  };
  return { set, onApply, isModified: () => isModified };
};

/**
 * For handling the dirty state of one setting
 */
export const createSetting =
  (globalOnChange: () => void) =>
  <T>(
    value: { initialValue: T; valueComparator?: SettingComparator<T> },
    modelOrView: "model" | "view",
  ) => {
    // TODO: use const instead of let (prefer-const) requires initializing
    let dirtyStatesOnChange: () => void;
    const onChange = () => {
      dirtyStatesOnChange();
    };

    const settingsValue = useSettingsValue(value, onChange);
    const controllingFlowVariables = useControllingFlowVariables(onChange);
    const exposedFlowVariables = useExposedFlowVariables(onChange);

    const dirtyStates = useDirtyStates(
      {
        apply: (): ApplyState => {
          if (controllingFlowVariables.isFlawed()) {
            return "idle";
          }
          if (exposedFlowVariables.isModified()) {
            return "configured";
          }
          if (modelOrView === "model") {
            if (
              settingsValue.isModified() ||
              controllingFlowVariables.isModified()
            ) {
              return "configured";
            }
            return "clean";
          } else {
            if (settingsValue.isModified() && exposedFlowVariables.isSet()) {
              // Node output changes
              return "configured";
            }
            if (
              settingsValue.isModified() ||
              controllingFlowVariables.isModified()
            ) {
              return "executed";
            }
            return "clean";
          }
        },
        view: (): ViewState => {
          if (controllingFlowVariables.isFlawed()) {
            return "idle";
          }
          if (!settingsValue.isModified()) {
            return "clean";
          }
          return modelOrView === "model" ? "configured" : "executed";
        },
      },
      () => globalOnChange(),
    );

    dirtyStatesOnChange = dirtyStates.onChange;

    const onApply = () => {
      settingsValue.onApply();
      controllingFlowVariables.onApply();
      exposedFlowVariables.onApply();
      /**
       * Not triggering callback here, since we would trigger it simultaneously for all registered settings
       */
      dirtyStates.onChange({ triggerCallbackOnChange: false });
    };

    return {
      public: {
        addControllingFlowVariable: controllingFlowVariables.add,
        addExposedFlowVariable: exposedFlowVariables.add,
        setValue: settingsValue.set,
      },
      internals: {
        onApply,
        getState: dirtyStates.getState,
      },
    };
  };
