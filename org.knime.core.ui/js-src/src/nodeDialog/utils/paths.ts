import { ConfigPath } from "../composables/components/useFlowVariables";
import { PersistSchema } from "../types/Persist";
import {
  DeprecatedConfigPathsCandidate,
  createNewCandidate,
  toConfigPathsWithDeprecatedConfigPaths,
  updateCandidates,
} from "./deprecatedPathsUtil";

export const composePaths = (path1: string, path2: string) => {
  if (path1 === "") {
    return path2;
  }
  return `${path1}.${path2}`;
};

const composeMultiplePaths = (paths: string[]) =>
  paths.reduce(composePaths, "");

const getNextConfigPathSegments = ({
  schema,
  segment,
}: {
  schema: PersistSchema;
  segment: string;
}): { configPaths: string[][]; continueTraversal: boolean } => {
  const configPaths = schema.configPaths;
  if (typeof configPaths === "undefined") {
    const configKey = schema.configKey ?? segment;
    return { configPaths: [[configKey]], continueTraversal: true };
  }
  return { configPaths, continueTraversal: false };
};

const getSubConfigKeysRecursive = (
  schema: PersistSchema,
  prefix: string[],
): string[][] => {
  if (!schema) {
    return [];
  }

  if (schema.type === "array") {
    return getSubConfigKeysRecursive(schema.items, prefix);
  } else if (schema.type === "object") {
    const subConfigKeys: string[][] = [];
    Object.entries(schema.properties).forEach(([key, subschema]) => {
      const { configPaths, continueTraversal } = getNextConfigPathSegments({
        schema: subschema,
        segment: key,
      });
      configPaths
        .map((configPath) => [...prefix, ...configPath])
        .forEach((newPrefix) =>
          continueTraversal
            ? subConfigKeys.push(
                ...getSubConfigKeysRecursive(schema.properties[key], newPrefix),
              )
            : subConfigKeys.push(newPrefix),
        );
    });
    return subConfigKeys;
  }
  return prefix.length ? [prefix] : [];
};

/**
 * Unless custom sub config keys are found in the given schema, sub config keys are inferred by traversing the schema
 * depth-first, replacing encountered segments with config keys, if custom config keys are found in the schema (as in
 * @see getConfigPaths). Further traversal at any segment ends prematurely if custom config keys are found in
 * the segment's schema.
 */
export const getSubConfigKeys = (schema: PersistSchema): string[][] => {
  return getSubConfigKeysRecursive(schema, []);
};

const composePathWithSubConfigKeys = (
  path: string,
  subConfigKeys: string[][],
) => {
  return subConfigKeys.length
    ? subConfigKeys.map((subConfigKey) =>
        composeMultiplePaths([path, ...subConfigKey]),
      )
    : [path];
};

/**
 * Config (persist) paths are assembled by traversing the persist schema along the given path, replacing any
 * segments along the traversal with custom config keys, if such custom config keys are found in any of the segments'
 * schemas. Potential sub config keys are then appended to to the determined config paths.
 *
 * Data (JsonForms schema) paths are assembled by concatenating the given path with any potential sub config keys of the
 * given control's schema.
 *
 * Note that there exists at least one data path in any case.
 *
 * @see getSubConfigKeys for details on how subConfigKeys are determined.
 */
export const getConfigPaths = ({
  path,
  persistSchema,
}: {
  persistSchema: PersistSchema;
  path: string;
}): ConfigPath[] => {
  const segments = path.split(".");
  let configPaths = [""];
  let schema = persistSchema;

  let traversalIsAborted = false;
  let deprecatedConfigPathsCandidates: DeprecatedConfigPathsCandidate[] = [];
  for (const segment of segments) {
    if (traversalIsAborted) {
      return [];
    }
    if (schema.type === "array") {
      configPaths = configPaths.map((p) => composePaths(p, segment));
      schema = schema.items;
    } else if (schema.type === "object") {
      schema = schema.properties[segment] ?? {};

      (schema.deprecatedConfigKeys ?? []).forEach((part) =>
        deprecatedConfigPathsCandidates.push(
          createNewCandidate(part, configPaths),
        ),
      );

      const { configPaths: nextPathSegments, continueTraversal } =
        getNextConfigPathSegments({ schema, segment });
      const nextComposedPathSegments =
        nextPathSegments.map(composeMultiplePaths);
      traversalIsAborted = !continueTraversal;

      configPaths = configPaths.flatMap((parent) =>
        nextComposedPathSegments.map((newSegment) =>
          composePaths(parent, newSegment),
        ),
      );

      deprecatedConfigPathsCandidates = updateCandidates(
        deprecatedConfigPathsCandidates,
        new Set(nextComposedPathSegments),
      );
    } else {
      configPaths = configPaths.map((parent) => composePaths(parent, segment));
      deprecatedConfigPathsCandidates = updateCandidates(
        deprecatedConfigPathsCandidates,
        new Set([segment]),
      );
    }
  }

  let dataPaths = [path];
  if (!traversalIsAborted) {
    const subConfigKeys = getSubConfigKeys(schema);
    configPaths = configPaths.flatMap((configPath) =>
      composePathWithSubConfigKeys(configPath, subConfigKeys),
    );
    dataPaths = composePathWithSubConfigKeys(path, subConfigKeys);
  }
  return toConfigPathsWithDeprecatedConfigPaths(
    configPaths,
    deprecatedConfigPathsCandidates,
  ).map(({ configPath, deprecatedConfigPaths }, index) => ({
    configPath,
    dataPath: dataPaths.length === 1 ? dataPaths[0] : dataPaths[index],
    deprecatedConfigPaths,
  }));
};

/**
 * Determines the longest common / shared prefix among a given array of paths.
 */
export const getLongestCommonPrefix = (paths: string[]) => {
  if (!paths.length) {
    return "";
  }
  const segments = paths[0].split(".");
  let prefix = "";
  for (const segment of segments) {
    for (let j = 1; j < paths.length; j++) {
      if (!paths[j].startsWith(prefix + segment)) {
        return paths[0].slice(0, prefix.length);
      }
    }
    prefix += segment.concat(".");
  }
  return paths[0];
};
