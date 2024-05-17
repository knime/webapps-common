import { TransformSettingsMethod } from "./useUpdates";

export default () => {
  const registeredTriggers = new Map<
    string,
    (indexIds: string[]) => TransformSettingsMethod
  >();

  const registerTrigger = (
    triggerId: string,
    callback: (indexIds: string[]) => TransformSettingsMethod,
  ) => {
    registeredTriggers.set(triggerId, callback);
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

  return { registerTrigger, getTriggerCallback };
};
