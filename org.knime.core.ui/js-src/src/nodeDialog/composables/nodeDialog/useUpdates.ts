import { Update, UpdateResult, ValueReference } from "../../types/Update";
import { set, get } from "lodash-es";
import { composePaths, toDataPath } from "@jsonforms/core";
import { inject } from "vue";
import {
  CreateAlertParams,
  DialogSettings,
  JsonDataService,
  UIExtensionService,
} from "@knime/ui-extension-service";
import Result from "@/nodeDialog/api/types/Result";
import { getIndex } from "./useArrayIds";
import { IsActiveCallback, TriggerCallback } from "./useTriggers";

const resolveToIndices = (ids: string[] | undefined) =>
  (ids ?? []).map((id) => getIndex(id));

export type DialogSettingsObject = DialogSettings & object;

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

const indicesAreDefined = (indices: (number | null)[]): indices is number[] =>
  !indices.includes(null);

const getToBeAdjustedSegments = (
  scopes: string[],
  indices: number[] | undefined,
  newSettings: DialogSettingsObject,
) => {
  const pathSegments = combineScopesWithIndices(scopes, indices ?? []);

  type SettingsWithPathGetter = {
    settings: object;
    /**
     * @param subPath a sub path within the settings object
     * @returns the total absolute path
     */
    path: string;
  };

  const toBeAdjustedByLastPathSegment = pathSegments
    .slice(0, pathSegments.length - 1)
    .reduce(
      (arrayOfSettings, dataPath) =>
        arrayOfSettings.flatMap(({ settings, path }) =>
          // accessing the settings at the current non-leaf dataPath, i.e. this has to be an array
          (get(settings, dataPath) as object[]).map(
            (subSettings, index): SettingsWithPathGetter => ({
              settings: subSettings,
              path: composePaths(composePaths(path, dataPath), `${index}`),
            }),
          ),
        ),
      [{ settings: newSettings, path: "" }] as SettingsWithPathGetter[],
    );
  return {
    toBeAdjustedByLastPathSegment,
    lastPathSegment: pathSegments[pathSegments.length - 1],
  };
};

export default ({
  callStateProviderListener,
  registerWatcher,
  registerTrigger,
  updateData,
  sendAlert,
  publishSettings,
}: {
  callStateProviderListener: (
    location: { id: string; indexIds?: string[] },
    value: unknown,
  ) => void;
  registerWatcher: (params: {
    dependencies: string[][];
    transformSettings: TriggerCallback;
  }) => void;
  /**
   * Used to trigger a new update depending on value update results (i.e. transitive updates)
   */
  updateData: (path: string, currentSettings: DialogSettingsObject) => void;
  registerTrigger: (
    id: string,
    isActive: IsActiveCallback,
    callback: TriggerCallback,
  ) => void;
  sendAlert: (params: CreateAlertParams) => void;
  publishSettings: () => void;
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

  const resolveUpdateResult =
    ({ scopes, value, id }: UpdateResult, indexIds?: string[]) =>
    (newSettings: DialogSettingsObject) => {
      if (scopes) {
        const currentIndices = resolveToIndices(indexIds);
        if (indicesAreDefined(currentIndices)) {
          const { toBeAdjustedByLastPathSegment, lastPathSegment } =
            getToBeAdjustedSegments(scopes, currentIndices, newSettings);
          toBeAdjustedByLastPathSegment.forEach(({ settings, path }) => {
            set(settings, lastPathSegment, value);
            updateData(composePaths(path, lastPathSegment), newSettings);
          });
          publishSettings();
        }
      } else if (id) {
        callStateProviderListener({ id, indexIds }, value);
      }
    };

  const resolveUpdateResults = (
    initialUpdates: UpdateResult[],
    currentSettings: DialogSettingsObject,
  ) =>
    initialUpdates
      .map((updateResult) => resolveUpdateResult(updateResult))
      .forEach((transform) => {
        transform(currentSettings);
      });

  const setValueTrigger = (scope: string[], callback: TriggerCallback) => {
    registerWatcher({
      dependencies: [scope],
      transformSettings: callback,
    });
  };

  const setTrigger = (
    trigger: Update["trigger"],
    isActive: IsActiveCallback,
    triggerCallback: TriggerCallback,
  ): null | ReturnType<TriggerCallback> => {
    if (trigger.scopes) {
      setValueTrigger(trigger.scopes, triggerCallback);
      return null;
    }

    if (trigger.triggerInitially) {
      return triggerCallback([]);
    }
    registerTrigger(trigger.id, isActive, triggerCallback);
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

  const getUpdateResults =
    ({ dependencies, trigger }: Update) =>
    (indexIds: string[]) =>
    (
      dependencySettings: DialogSettingsObject,
    ): Promise<Result<UpdateResult[]>> => {
      const indicesBeforeUpdate = resolveToIndices(indexIds);
      if (!indicesAreDefined(indicesBeforeUpdate)) {
        throw Error("Trigger called with wrong ids: No indices found.");
      }
      const currentDependencies = extractCurrentDependencies(
        dependencies,
        dependencySettings,
        indicesBeforeUpdate,
      );
      return callDataServiceUpdate2({
        triggerId: trigger.id,
        currentDependencies,
      });
    };

  const isUpdateNecessary = ({
    updateResult,
    settings,
    indexIds,
  }: {
    updateResult: UpdateResult[];
    settings: DialogSettingsObject;
    indexIds: string[];
  }) =>
    Boolean(
      updateResult.find(({ id, scopes, value }) => {
        if (id) {
          // for simplicity, if an ui state is provided, the update is seen as necessary
          return true;
        }
        if (scopes) {
          const currentIndices = resolveToIndices(indexIds);
          if (indicesAreDefined(currentIndices)) {
            const { toBeAdjustedByLastPathSegment, lastPathSegment } =
              getToBeAdjustedSegments(scopes, currentIndices, settings);
            if (
              toBeAdjustedByLastPathSegment.find(
                ({ settings: s }) => get(s, lastPathSegment) !== value,
              )
            ) {
              return true;
            }
          }
        }
        return false;
      }),
    );

  const getIsUpdateNecessary =
    ({ dependencies, trigger }: Update) =>
    (indexIds: string[]) =>
    async (
      dependencySettings: DialogSettingsObject,
    ): Promise<Result<boolean>> => {
      const response = await getUpdateResults({ dependencies, trigger })(
        indexIds,
      )(dependencySettings);
      if (response.state === "SUCCESS") {
        const isNecessary = isUpdateNecessary({
          updateResult: response.result,
          settings: dependencySettings,
          indexIds,
        });
        return {
          state: "SUCCESS",
          result: isNecessary,
          message: response.message,
        };
      }
      return response;
    };

  const getTriggerCallback =
    ({ dependencies, trigger }: Update): TriggerCallback =>
    (indexIds) =>
    async (dependencySettings) => {
      const response = await getUpdateResults({ dependencies, trigger })(
        indexIds,
      )(dependencySettings);
      return (newSettings) => {
        if (response.state === "FAIL" || response.state === "SUCCESS") {
          sendAlerts(response.message);
        }
        if (response.state === "SUCCESS") {
          (response.result ?? []).forEach((updateResult: UpdateResult) => {
            resolveUpdateResult(updateResult, indexIds)(newSettings);
          });
        }
      };
    };

  /**
   * @param globalUpdates from the uischema
   * @returns possibly an immediate induced initial transformation
   */
  const registerUpdates = (
    globalUpdates: Update[],
  ): null | ReturnType<TriggerCallback> => {
    let initialTransformation: null | ReturnType<TriggerCallback> = null;
    globalUpdates.forEach((update) => {
      const isActive = getIsUpdateNecessary(update);
      const inducedInitialTransformation = setTrigger(
        update.trigger,
        isActive,
        getTriggerCallback(update),
      );
      initialTransformation =
        inducedInitialTransformation ?? initialTransformation;
    });
    return initialTransformation;
  };

  return { registerUpdates, resolveUpdateResults };
};
