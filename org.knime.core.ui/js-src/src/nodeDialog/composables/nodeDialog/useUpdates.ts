import { Update, UpdateResult } from "../../types/Update";
import { cloneDeep, set, get } from "lodash-es";
import { toDataPath } from "@jsonforms/core";
import { inject } from "vue";
import {
  CreateAlertParams,
  DialogSettings,
  JsonDataService,
  UIExtensionService,
} from "@knime/ui-extension-service";
import Result from "@/nodeDialog/api/types/Result";

type DialogSettingsObject = DialogSettings & object;

export type TransformSettingsMethod = (
  newSettings: DialogSettingsObject,
) => Promise<DialogSettingsObject>;

/**
 * @returns an array of paths. If there are multiple, all but the first one lead to an array in which every index is to be adjusted.
 */
const combinePathWithIndices = (path: string | string[], indices: number[]) => {
  if (typeof path === "string") {
    return [toDataPath(path)];
  }
  return path.map(toDataPath).reduce((segments, dataPath, i) => {
    if (i === 0) {
      segments[0] = dataPath;
    } else if (i <= indices.length) {
      segments[0] = `${segments[0]}.${indices[i - 1]}.${dataPath}`;
    } else {
      segments.push(dataPath);
    }
    return segments;
  }, [] as string[]);
};

export default ({
  callStateProviderListener,
  registerWatcher,
  registerTrigger,
  sendAlert,
}: {
  callStateProviderListener: (
    location: { id: string; indices?: number[] },
    value: unknown,
  ) => void;
  registerWatcher: (params: {
    dependencies: string[][];
    transformSettings: (indices: number[]) => TransformSettingsMethod;
  }) => void;
  registerTrigger: (
    id: string,
    callback: (indices: number[]) => TransformSettingsMethod,
  ) => void;
  sendAlert: (params: CreateAlertParams) => void;
}) => {
  const baseService = inject<() => UIExtensionService>("getKnimeService")!();
  const jsonDataService = new JsonDataService(baseService);

  const resolveUpdateResult =
    ({ path, value, id }: UpdateResult, indices?: number[]) =>
    (newSettings: DialogSettingsObject) => {
      if (path) {
        const pathSegments = combinePathWithIndices(path, indices ?? []);
        const toBeAdjustedByLastPathSegment = pathSegments
          .slice(0, pathSegments.length - 1)
          .reduce(
            (arrayOfSettings, dataPath) =>
              arrayOfSettings.flatMap((settings) => get(settings, dataPath)),
            [newSettings] as object[],
          );
        toBeAdjustedByLastPathSegment.forEach((settings) =>
          set(settings, pathSegments[pathSegments.length - 1], value),
        );
      } else if (id) {
        callStateProviderListener({ id, indices }, value);
      }
      return newSettings;
    };

  const copyAndTransform = <T>(
    settings: DialogSettingsObject,
    updateSettings: (newSettings: DialogSettingsObject) => T,
  ): T => {
    const newSettings = cloneDeep(settings);
    return updateSettings(newSettings);
  };

  const resolveUpdateResults = (
    initialUpdates: UpdateResult[],
    currentSettings: DialogSettingsObject,
  ) => {
    if (initialUpdates.length === 0) {
      return currentSettings;
    }
    return copyAndTransform(currentSettings, (newSettings) => {
      initialUpdates
        .map((updateResult) => resolveUpdateResult(updateResult))
        .forEach((transform) => {
          newSettings = transform(newSettings);
        });
      return newSettings;
    });
  };

  const setValueTrigger = (
    scope: string[],
    callback: (indices: number[]) => TransformSettingsMethod,
  ) => {
    registerWatcher({
      dependencies: [scope],
      transformSettings: callback,
    });
  };

  const setTrigger = (
    trigger: Update["trigger"],
    triggerCallback: (indices: number[]) => TransformSettingsMethod,
  ): null | TransformSettingsMethod => {
    if (trigger.scopes) {
      setValueTrigger(trigger.scopes, triggerCallback);
      return null;
    }
    const transformSettings =
      (indices: number[]): TransformSettingsMethod =>
      (settings) =>
        copyAndTransform(settings, triggerCallback(indices));

    if (trigger.triggerInitially) {
      return transformSettings([]);
    }
    registerTrigger(trigger.id, transformSettings);
    return null;
  };

  const callDataServiceUpdate2 = ({
    triggerId,
    currentDependencies,
  }: {
    triggerId: string;
    currentDependencies: Record<string, any>;
  }): Promise<Result<UpdateResult[]>> =>
    jsonDataService.data({
      method: "settings.update2",
      options: [null, triggerId, currentDependencies],
    });

  const getTriggerCallback =
    ({ dependencies, trigger }: Update) =>
    (indices: number[]): TransformSettingsMethod =>
    async (newSettings) => {
      const currentDependencies = Object.fromEntries(
        dependencies.map((dep) => [
          dep.id,
          get(newSettings, toDataPath(dep.scope)),
        ]),
      );
      const response = await callDataServiceUpdate2({
        triggerId: trigger.id,
        currentDependencies,
      });
      if (response.state === "FAIL" || response.state === "SUCCESS") {
        response.message.forEach((message) =>
          sendAlert({
            message,
          }),
        );
      }
      if (response.state === "SUCCESS") {
        (response.result ?? []).forEach((updateResult: UpdateResult) => {
          newSettings = resolveUpdateResult(updateResult, indices)(newSettings);
        });
      }
      return newSettings;
    };

  /**
   * @param globalUpdates from the uischema
   * @returns possibly an immediate induced initial transformation
   */
  const registerUpdates = (
    globalUpdates: Update[],
  ): null | TransformSettingsMethod => {
    let initialTransformation: null | TransformSettingsMethod = null;
    globalUpdates.forEach((update) => {
      const inducedInitialTransformation = setTrigger(
        update.trigger,
        getTriggerCallback(update),
      );
      initialTransformation =
        inducedInitialTransformation ?? initialTransformation;
    });
    return initialTransformation;
  };

  return { registerUpdates, resolveUpdateResults };
};
