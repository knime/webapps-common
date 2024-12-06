/* eslint-disable no-magic-numbers */
import type {
  APILayerDirtyState,
  ApplyState,
  ViewState,
} from "@knime/ui-extension-renderer/api";

import type { SettingComparator } from "./SettingComparator";
import { createSetting } from "./setting";
import type { SettingState } from "./types";

type Construct<T extends object> = {
  [K in keyof T]: () => T[K];
};

const useDirtyStatesGeneric =
  <T extends { [key: string]: any }>(cleanState: T) =>
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
  apply: "clean",
  view: "clean",
});

export const createDialogDirtyStateHandler = (
  onDirtyStateChange: (dirtyStates: APILayerDirtyState) => void,
) => {
  const settings: {
    onApply: () => void;
    getState: () => APILayerDirtyState;
  }[] = [];

  const getStates = () => settings.map(({ getState }) => getState());

  const applyStateRanking = {
    clean: 0,
    executed: 1,
    configured: 2,
    idle: 3,
  } as const satisfies Record<ApplyState, number>;

  const viewStateRanking = applyStateRanking satisfies Record<
    ViewState,
    number
  >;

  const compareByRank =
    <T extends string>(ranking: Record<T, number>) =>
    (a: T, b: T) =>
      ranking[a] - ranking[b];

  const construct = {
    apply: () =>
      getStates()
        .map(({ apply }) => apply)
        .sort(compareByRank(applyStateRanking))
        .pop() ?? "clean",
    view: () =>
      getStates()
        .map(({ view }) => view)
        .sort(compareByRank(viewStateRanking))
        .pop() ?? "clean",
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
