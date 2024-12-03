import { inject, nextTick } from "vue";
import { composePaths, toDataPath } from "@jsonforms/core";
import { get, set } from "lodash-es";

import {
  type AlertParams,
  AlertType,
  type DialogSettings,
  JsonDataService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import type { Result } from "@/nodeDialog/api/types/Result";
import type {
  IndexIdsValuePairs,
  Pairs,
  Update,
  UpdateResult,
  ValueReference,
} from "../../types/Update";

import { getIndex } from "./useArrayIds";
import type {
  IndexedIsActive,
  IsActiveCallback,
  TriggerCallback,
} from "./useTriggers";
import { combineScopesWithIndices } from "./utils/dataPaths";
import { getDependencyValues } from "./utils/dependencyExtraction";
import {
  isIndexIdsAndValuePairs,
  toIndicesValuePairs,
} from "./utils/updateResults";

const resolveToIndices = (ids: string[] | undefined) =>
  (ids ?? []).map((id) => getIndex(id));

export type DialogSettingsObject = DialogSettings & object;

const indicesAreDefined = (indices: (number | null)[]): indices is number[] =>
  !indices.includes(null);

const getToBeAdjustedSegments = (
  scopes: string[],
  /**
   * Indices starting from the root applied to all targets
   */
  indices: number[] | undefined,
  /**
   * Mapping further indices to the respective values
   */
  values: [number[], unknown][],
  newSettings: DialogSettingsObject,
) => {
  const pathSegments = combineScopesWithIndices(scopes, indices ?? []);

  type SettingsWithPath = {
    settings: object;
    /**
     * @param subPath a sub path within the settings object
     * @returns the total absolute path
     */
    path: string;
    /**
     * The values that are to be adjusted at the remaining paths
     * once the algorithm reaches the last path segment, this is a one-element array with empty numbers
     */
    values: [number[], unknown][];
  };

  const toBeAdjustedByLastPathSegment = pathSegments
    .slice(0, pathSegments.length - 1)
    .reduce(
      (arrayOfSettings, dataPath) =>
        arrayOfSettings.flatMap(({ settings, path, values }) => {
          // accessing the settings at the current non-leaf dataPath, i.e. this has to be an array
          const arraySettings = get(settings, dataPath) as object[];
          const firstKey = values[0][0];
          if (!firstKey) {
            throw Error("Should not happen");
          }
          // no further specific indices are provided, so we have to adjust all indices
          if (firstKey.length === 0) {
            return arraySettings.map(
              (subSettings, index): SettingsWithPath => ({
                settings: subSettings,
                path: composePaths(composePaths(path, dataPath), `${index}`),
                values,
              }),
            );
          } else {
            // group by first index of keys
            const groupedValues = values.reduce((grouped, [key, value]) => {
              const firstIndex = key[0];
              if (!grouped.has(firstIndex)) {
                grouped.set(firstIndex, []);
              }
              grouped.get(firstIndex)!.push([key.slice(1), value]);
              return grouped;
            }, new Map<number, [number[], unknown][]>());
            return [...groupedValues.entries()].map(([index, valueMap]) => {
              const subSettings = arraySettings[index];
              return {
                settings: subSettings,
                path: composePaths(composePaths(path, dataPath), `${index}`),
                values: valueMap,
              };
            });
          }
        }),
      [{ settings: newSettings, path: "", values }] as SettingsWithPath[],
    );
  return {
    toBeAdjustedByLastPathSegment,
    lastPathSegment: pathSegments[pathSegments.length - 1],
  };
};

export default ({
  callStateProviderListener,
  callStateProviderListenerByIndices,
  registerWatcher,
  registerTrigger,
  updateData,
  sendAlert,
  publishSettings,
  pathIsControlledByFlowVariable,
}: {
  callStateProviderListener: (
    location: { id: string; indexIds?: string[] },
    value: unknown,
  ) => void;
  callStateProviderListenerByIndices: (
    location: { id: string; indices: number[] },
    value: unknown,
  ) => void;
  registerWatcher: (params: {
    dependencies: string[][];
    transformSettings: TriggerCallback;
  }) => void;
  /**
   * Used to trigger a new update depending on value update results (i.e. transitive updates)
   */
  updateData: (paths: string[]) => void;
  registerTrigger: (
    id: string,
    isActive: IsActiveCallback,
    callback: TriggerCallback,
  ) => void;
  sendAlert: (params: AlertParams) => void;
  publishSettings: () => void;
  pathIsControlledByFlowVariable: (path: string) => boolean;
}) => {
  const baseService = inject<() => UIExtensionService>("getKnimeService")!();
  const jsonDataService = new JsonDataService(baseService);

  const resolveUpdateResult =
    (
      { scopes, values, id }: UpdateResult,
      onValueUpdate: (path: string) => void,
      indexIds: string[],
    ) =>
    (newSettings: DialogSettingsObject) => {
      const indices = resolveToIndices(indexIds);

      if (!indicesAreDefined(indices)) {
        return;
      }

      if (scopes) {
        const indicesValuePairs = isIndexIdsAndValuePairs(values)
          ? toIndicesValuePairs(values, getIndex)
          : values;
        const { toBeAdjustedByLastPathSegment, lastPathSegment } =
          getToBeAdjustedSegments(
            scopes,
            indices,
            indicesValuePairs.map(({ indices, value }) => [indices, value]),
            newSettings,
          );
        toBeAdjustedByLastPathSegment.forEach(
          ({ settings, path, values: [[, value]] }) => {
            const fullToBeUpdatedPath = composePaths(path, lastPathSegment);
            if (!pathIsControlledByFlowVariable(fullToBeUpdatedPath)) {
              set(settings, lastPathSegment, value);
              onValueUpdate(fullToBeUpdatedPath);
            }
          },
        );
        publishSettings();
      } else if (id) {
        if (isIndexIdsAndValuePairs(values)) {
          values.forEach(({ indices: valueIndexIds, value }) =>
            callStateProviderListener(
              { id, indexIds: [...indexIds, ...valueIndexIds] },
              value,
            ),
          );
        } else {
          values.forEach(({ indices: valueIndices, value }) =>
            callStateProviderListenerByIndices(
              { id, indices: [...indices, ...valueIndices] },
              value,
            ),
          );
        }
      }
    };

  const resolveUpdateResults = (
    initialUpdates: UpdateResult[],
    currentSettings: DialogSettingsObject,
    indexIds: string[] = [],
  ) => {
    const updatedPaths: string[] = [];
    initialUpdates
      .map((updateResult) =>
        resolveUpdateResult(
          updateResult,
          (path) => updatedPaths.push(path),
          indexIds,
        ),
      )
      .forEach((transform) => {
        transform(currentSettings);
      });
    // we have to wait one tick to ensure that array element ids are set correctly
    nextTick(() => updateData(updatedPaths));
  };

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
  ) =>
    Object.fromEntries<Pairs>(
      dependencies.map((dep) => [
        dep.id,
        getDependencyValues(newSettings, dep.scopes.map(toDataPath), indices),
      ]),
    );

  const callDataServiceUpdate2 = ({
    triggerId,
    currentDependencies,
  }: {
    triggerId: string;
    currentDependencies: Record<string, Pairs>;
  }): Promise<Result<UpdateResult[]>> =>
    jsonDataService.data({
      method: "settings.update2",
      options: [null, triggerId, currentDependencies],
    });

  const sendAlerts = (messages: string[] | undefined) => {
    messages?.forEach((message) =>
      sendAlert({
        message,
        type: AlertType.ERROR,
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

  const getOrCreateIndicesEntry = (
    indexIds: string[],
    acc: IndexedIsActive[],
  ) => {
    let existing = acc.find(
      ({ indices }) => JSON.stringify(indices) === JSON.stringify(indexIds),
    );
    if (!existing) {
      existing = { indices: indexIds, isActive: false };
      acc.push(existing);
    }
    return existing;
  };

  const isUpdateAtIndicesNecessary = ({
    scopes,
    currentIndices,
    indexIds,
    value,
    settings,
  }: {
    scopes: string[];
    currentIndices: number[];
    indexIds: string[];
    value: unknown;
    settings: object;
  }) => {
    const indices = indexIds.map(getIndex);
    if (!indicesAreDefined(indices)) {
      return false;
    }
    const { toBeAdjustedByLastPathSegment, lastPathSegment } =
      getToBeAdjustedSegments(
        scopes,
        currentIndices,
        [[indices, value]],
        settings,
      );
    return Boolean(
      toBeAdjustedByLastPathSegment.find(({ settings: s, values: [[, v]] }) => {
        return get(s, lastPathSegment) !== v;
      }),
    );
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
    updateResult.reduce((acc: IndexedIsActive[], { id, scopes, values }) => {
      const currentIndices = resolveToIndices(indexIds);
      if (!indicesAreDefined(currentIndices)) {
        return acc;
      }
      (values as IndexIdsValuePairs).forEach(({ indices: indexIds, value }) => {
        const existing = getOrCreateIndicesEntry(indexIds, acc);
        if (id) {
          // for simplicity, if an ui state is provided, the update is seen as necessary
          existing.isActive = true;
        } else if (scopes) {
          if (
            isUpdateAtIndicesNecessary({
              scopes,
              currentIndices,
              indexIds,
              value,
              settings,
            })
          ) {
            existing.isActive = true;
          }
        }
      });
      return acc;
    }, [] satisfies IndexedIsActive[]);

  const getIsUpdateNecessary =
    ({ dependencies, trigger }: Update) =>
    (indexIds: string[]) =>
    async (
      dependencySettings: DialogSettingsObject,
    ): Promise<Result<IndexedIsActive[]>> => {
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
          resolveUpdateResults(response.result ?? [], newSettings, indexIds);
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
