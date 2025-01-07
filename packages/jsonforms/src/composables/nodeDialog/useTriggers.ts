import type { Result } from "../../api/types/Result";

import type { DialogSettingsObject } from "./useUpdates";

export type IndexedIsActive = { indices: string[]; isActive: boolean };
export type IsActiveCallback = (
  indexIds: string[],
) => (settings: DialogSettingsObject) => Promise<Result<IndexedIsActive[]>>;

export type TriggerCallback = (
  indexIds: string[],
) => (
  dependencySettings: DialogSettingsObject,
) => Promise<(newSettings: DialogSettingsObject) => void>;

export default () => {
  const registeredTriggers = new Map<string, TriggerCallback>();

  const registeredTriggersActive = new Map<string, IsActiveCallback>();

  const registerTrigger = (
    triggerId: string,
    isActive: IsActiveCallback,
    callback: TriggerCallback,
  ) => {
    registeredTriggers.set(triggerId, callback);
    registeredTriggersActive.set(triggerId, isActive);
  };

  const getTriggerCallback = ({
    id,
    indexIds,
  }: {
    id: string;
    indexIds?: string[];
  }) => {
    const callback = registeredTriggers.get(id);
    if (!callback) {
      throw Error(`No trigger registered for id ${id}`);
    }
    return callback(indexIds ?? []);
  };

  const getTriggerIsActiveCallback = ({
    id,
    indexIds,
  }: {
    id: string;
    indexIds?: string[];
  }) => {
    const callback = registeredTriggersActive.get(id);
    if (!callback) {
      throw Error(`No trigger registered for id ${id}`);
    }
    return callback(indexIds ?? []);
  };

  return { registerTrigger, getTriggerCallback, getTriggerIsActiveCallback };
};
