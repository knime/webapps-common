import { Update, UpdateResult, ValueReference } from "../../types/Update";
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
import { RegisterWatcherTransformSettings } from "./useGlobalWatchers";
import { getIndex } from "./useArrayIds";

const resolveToIndices = (ids: string[] | undefined) =>
  (ids ?? []).map((id) => getIndex(id));

type DialogSettingsObject = DialogSettings & object;

export type TransformSettingsMethod = (
  newSettings: DialogSettingsObject,
) => Promise<DialogSettingsObject>;

/**
 * @returns an array of paths. If there are multiple, all but the first one lead to an array in
 * which every index is to be adjusted.
 */
const combineScopesWithIndices = (scopes: string[], indices: number[]) => {
  return scopes.map(toDataPath).reduce((segments, dataPath, i) => {
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
    location: { id: string; indexIds?: string[] },
    value: unknown,
  ) => void;
  registerWatcher: (params: {
    dependencies: string[][];
    transformSettings: RegisterWatcherTransformSettings;
  }) => void;
  registerTrigger: (
    id: string,
    callback: (indexIds: string[]) => TransformSettingsMethod,
  ) => void;
  sendAlert: (params: CreateAlertParams) => void;
}) => {
  const baseService = inject<() => UIExtensionService>("getKnimeService")!();
  const jsonDataService = new JsonDataService(baseService);

  const getSingleDataPathOrThrow = (scopes: string[], indices: number[]) => {
    const combined = combineScopesWithIndices(scopes, indices);
    if (combined.length > 1) {
      const message =
        "Having dependencies within array layout elements for an update that is not triggered within " +
        "the array layout is not yet supported";
      sendAlert({
        message,
      });
      // @ts-expect-errors
      if (!window.isTest) {
        throw Error(message);
      }
    }
    return combined[0];
  };

  const indicesAreDefined = (indices: (number | null)[]): indices is number[] =>
    !indices.includes(null);

  const getToBeAdjustedSegments = (
    scopes: string[],
    indices: number[] | undefined,
    newSettings: DialogSettingsObject,
  ) => {
    const pathSegments = combineScopesWithIndices(scopes, indices ?? []);
    const toBeAdjustedByLastPathSegment = pathSegments
      .slice(0, pathSegments.length - 1)
      .reduce(
        (arrayOfSettings, dataPath) =>
          arrayOfSettings.flatMap((settings) => get(settings, dataPath)),
        [newSettings] as object[],
      );
    return { toBeAdjustedByLastPathSegment, pathSegments };
  };

  const resolveUpdateResult =
    ({ scopes, value, id }: UpdateResult, indexIds?: string[]) =>
    (newSettings: DialogSettingsObject) => {
      if (scopes) {
        const currentIndices = resolveToIndices(indexIds);
        if (indicesAreDefined(currentIndices)) {
          const { toBeAdjustedByLastPathSegment, pathSegments } =
            getToBeAdjustedSegments(scopes, currentIndices, newSettings);
          toBeAdjustedByLastPathSegment.forEach((settings) => {
            set(settings, pathSegments[pathSegments.length - 1], value);
          });
        }
      } else if (id) {
        callStateProviderListener({ id, indexIds }, value);
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
    callback: RegisterWatcherTransformSettings,
  ) => {
    registerWatcher({
      dependencies: [scope],
      transformSettings: callback,
    });
  };

  const setTrigger = (
    trigger: Update["trigger"],
    triggerCallback: RegisterWatcherTransformSettings,
  ): null | TransformSettingsMethod => {
    if (trigger.scopes) {
      setValueTrigger(trigger.scopes, triggerCallback);
      return null;
    }
    const transformSettings =
      (indexIds: string[]): TransformSettingsMethod =>
      (settings) =>
        copyAndTransform(settings, async (settings) => {
          const inducedTransformation = await triggerCallback(indexIds)(
            settings,
          );
          return inducedTransformation(settings);
        });

    if (trigger.triggerInitially) {
      return transformSettings([]);
    }
    registerTrigger(trigger.id, transformSettings);
    return null;
  };

  const extractCurrentDependencies = (
    dependencies: ValueReference[],
    newSettings: object,
    indices: number[],
  ) => {
    return Object.fromEntries(
      dependencies.map((dep) => [
        dep.id,
        get(newSettings, getSingleDataPathOrThrow(dep.scopes, indices)),
      ]),
    );
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

  const sendAlerts = (messages: string[] | undefined) => {
    messages?.forEach((message) =>
      sendAlert({
        message,
      }),
    );
  };
  const getTriggerCallback =
    ({ dependencies, trigger }: Update) =>
    (indexIds: string[]) =>
    async (
      dependencySettings: DialogSettingsObject,
    ): Promise<(newSettings: DialogSettingsObject) => DialogSettingsObject> => {
      const indicesBeforeUpdate = resolveToIndices(indexIds);
      if (!indicesAreDefined(indicesBeforeUpdate)) {
        throw Error("Trigger called with wrong ids: No indices found.");
      }
      const currentDependencies = extractCurrentDependencies(
        dependencies,
        dependencySettings,
        indicesBeforeUpdate,
      );
      const response = await callDataServiceUpdate2({
        triggerId: trigger.id,
        currentDependencies,
      });
      return (newSettings) => {
        if (response.state === "FAIL" || response.state === "SUCCESS") {
          sendAlerts(response.message);
        }
        if (response.state === "SUCCESS") {
          (response.result ?? []).forEach((updateResult: UpdateResult) => {
            newSettings = resolveUpdateResult(
              updateResult,
              indexIds,
            )(newSettings);
          });
        }
        return newSettings;
      };
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
