import { APILayerDirtyState, ApplyState, ViewState } from "@/types";

import { SettingComparator } from "./SettingComparator";
import { createSetting } from "./setting";
import { SettingState } from "./types";

type Construct<T extends object> = {
  [K in keyof T]: () => T[K];
};

const useDirtyStatesGeneric =
  <T extends object>(cleanState: T) =>
  (construct: Construct<T>, onChangeCallback?: (state: T) => void) => {
    const state = { ...cleanState };

    const onChange = (
      { triggerCallbackOnChange }: { triggerCallbackOnChange: boolean } = {
        triggerCallbackOnChange: true,
      },
    ) => {
      const newState: T = Object.entries(construct).reduce(
        (acc, [key, getter]: any) => {
          acc[key] = getter();
          return acc;
        },
        {} as any,
      );

      const isNew = Object.keys(newState).some(
        (key) => newState[key] !== state[key],
      );

      if (isNew) {
        Object.assign(state, newState);
        if (triggerCallbackOnChange) {
          onChangeCallback?.(state);
        }
      }
    };

    return {
      getState: () => state,
      onChange,
    };
  };

export const useDirtyStates = useDirtyStatesGeneric<APILayerDirtyState>({
  apply: ApplyState.CLEAN,
  view: ViewState.CLEAN,
});

export const createDialogDirtyStateHandler = (
  onDirtyStateChange: (dirtyStates: APILayerDirtyState) => void,
) => {
  const settings: {
    onApply: () => void;
    getState: () => APILayerDirtyState;
  }[] = [];

  const getStates = () => settings.map(({ getState }) => getState());

  const construct = {
    apply: () =>
      getStates()
        .map(({ apply }) => apply)
        .sort()
        .pop() ?? ApplyState.CLEAN,
    view: () =>
      getStates()
        .map(({ view }) => view)
        .sort()
        .pop() ?? ViewState.CLEAN,
  };

  const { onChange } = useDirtyStates(construct, onDirtyStateChange);
  const constructNewSetting = createSetting(onChange);

  const addSetting =
    (modelOrView: "model" | "view") =>
    <T>(value: {
      initialValue: T;
      valueComparator?: SettingComparator<T>;
    }): SettingState<T> => {
      const setting = constructNewSetting(value, modelOrView);
      settings.push(setting.internals);
      return setting.public;
    };

  const onApply = () => {
    settings.forEach(({ onApply }) => onApply());
    onChange();
  };

  return { addSetting, onApply };
};
