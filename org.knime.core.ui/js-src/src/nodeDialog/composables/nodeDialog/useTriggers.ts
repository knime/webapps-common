import { TransformSettingsMethod } from "./useUpdates";

export default () => {
  const registeredTriggers = new Map<
    string,
    (indices: number[]) => TransformSettingsMethod
  >();

  const registerTrigger = (
    triggerId: string,
    callback: (indices: number[]) => TransformSettingsMethod,
  ) => {
    registeredTriggers.set(triggerId, callback);
  };

  const getTriggerCallback = ({
    id,
    indices,
  }: {
    id: string;
    indices?: number[];
  }) => {
    const callback = registeredTriggers.get(id);
    if (!callback) {
      throw Error(`No trigger registered for id ${id}`);
    }
    return callback(indices ?? []);
  };

  return { registerTrigger, getTriggerCallback };
};
