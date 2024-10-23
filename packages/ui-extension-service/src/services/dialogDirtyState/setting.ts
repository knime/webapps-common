/* eslint-disable class-methods-use-this */
import { ApplyState, ViewState } from "@/types";
import { useDirtyStates } from ".";
import {
  DefaultSettingComparator,
  SettingComparator,
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
    // eslint-disable-next-line prefer-const
    let dirtyStatesOnChange: () => void;
    const onChange = () => {
      dirtyStatesOnChange();
    };

    const settingsValue = useSettingsValue(value, onChange);
    const controllingFlowVariables = useControllingFlowVariables(onChange);
    const exposedFlowVariables = useExposedFlowVariables(onChange);

    const dirtyStates = useDirtyStates(
      {
        apply: () => {
          if (controllingFlowVariables.isFlawed()) {
            return ApplyState.IDLE;
          }
          if (exposedFlowVariables.isModified()) {
            return ApplyState.CONFIG;
          }
          if (modelOrView === "model") {
            if (
              settingsValue.isModified() ||
              controllingFlowVariables.isModified()
            ) {
              return ApplyState.CONFIG;
            }
            return ApplyState.CLEAN;
          } else {
            if (settingsValue.isModified() && exposedFlowVariables.isSet()) {
              // Node output changes
              return ApplyState.CONFIG;
            }
            if (
              settingsValue.isModified() ||
              controllingFlowVariables.isModified()
            ) {
              return ApplyState.EXEC;
            }
            return ApplyState.CLEAN;
          }
        },
        view: () => {
          if (controllingFlowVariables.isFlawed()) {
            return ViewState.IDLE;
          }
          if (!settingsValue.isModified()) {
            return ViewState.CLEAN;
          }
          return modelOrView === "model" ? ViewState.CONFIG : ViewState.EXEC;
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
