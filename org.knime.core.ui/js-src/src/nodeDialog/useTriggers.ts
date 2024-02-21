import { TransformSettingsMethod } from "./useUpdates";

export default () => {
  const registeredTriggers = new Map<string, TransformSettingsMethod>();

  const registerTrigger = (
    triggerId: string,
    callback: TransformSettingsMethod,
  ) => {
    registeredTriggers.set(triggerId, callback);
  };

  const getTriggerCallback = (trigger: string) => {
    const callback = registeredTriggers.get(trigger);
    if (!callback) {
      throw Error(`No trigger registered for id ${trigger}`);
    }
    return callback;
  };

  return { registerTrigger, getTriggerCallback };
};
