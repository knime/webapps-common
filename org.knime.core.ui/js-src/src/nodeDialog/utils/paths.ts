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

const getNextConfigPathSegments = ({
  schema,
  segment,
}: {
  schema: PersistSchema;
  segment: string;
}) => {
  const configKeys = schema.configKeys;
  if (typeof configKeys === "undefined" || !configKeys.length) {
    return [segment];
  }
  return configKeys;
};

const getSubConfigKeysRecursive = (
  schema: PersistSchema,
  prefix: string[],
): string[][] => {
  if (!schema) {
    return [];
  }

  if (schema.subConfigKeys) {
    return schema.subConfigKeys.map((subConfigKey) => [
      ...prefix,
      ...subConfigKey,
    ]);
  }

  if (schema.type === "array") {
    return getSubConfigKeysRecursive(schema.items, prefix);
  } else if (schema.type === "object") {
    const subConfigKeys: string[][] = [];
    for (const key of Object.keys(schema.properties)) {
      const configKeys = getNextConfigPathSegments({
        schema: schema.properties[key],
        segment: key,
      });
      configKeys
        .filter((configKey) => !configKey.endsWith("_Internals"))
        .forEach((configKey) =>
          subConfigKeys.push(
            ...getSubConfigKeysRecursive(schema.properties[key], [
              ...prefix,
              configKey,
            ]),
          ),
        );
    }
    return subConfigKeys;
  }
  return prefix.length ? [prefix] : [];
};

/**
 * Unless custom sub config keys are found in the given schema, sub config keys are inferred by traversing the schema
 * depth-first, replacing encountered segments with config keys, if custom config keys are found in the schema (as in
 * @see getConfigPaths). Further traversal at any segment ends prematurely if, (i) custom sub config keys are found in
 * the segment's schema or (ii) the current segment's config key is hidden (i.e., suffixed with "_Internals").
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
        composePaths(
          path,
          subConfigKey.reduce(
            (prefix, suffix) => composePaths(prefix, suffix),
            "",
          ),
        ),
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
export const getDataAndConfigPaths = ({
  path,
  persistSchema,
}: {
  persistSchema: PersistSchema;
  path: string;
}): {
  configPaths: { configPath: string; deprecatedConfigPaths: string[] }[];
  dataPaths: string[];
} => {
  const segments = path.split(".");
  let configPaths = [""];
  let schema = persistSchema;
  let deprecatedConfigPathsCandidates: DeprecatedConfigPathsCandidate[] = [];
  for (const segment of segments) {
    if (schema.type === "array") {
      configPaths = configPaths.map((p) => composePaths(p, segment));
      schema = schema.items;
    } else if (schema.type === "object") {
      schema = schema.properties[segment];

      (schema.deprecatedConfigKeys ?? []).forEach((part) =>
        deprecatedConfigPathsCandidates.push(
          createNewCandidate(part, configPaths),
        ),
      );

      const nextPathSegments = getNextConfigPathSegments({ schema, segment });

      configPaths = configPaths.flatMap((parent) =>
        nextPathSegments.map((newSegment) => composePaths(parent, newSegment)),
      );

      deprecatedConfigPathsCandidates = updateCandidates(
        deprecatedConfigPathsCandidates,
        new Set(nextPathSegments),
      );
    } else {
      configPaths = configPaths.map((parent) => composePaths(parent, segment));
      deprecatedConfigPathsCandidates = updateCandidates(
        deprecatedConfigPathsCandidates,
        new Set([segment]),
      );
    }
  }

  const subConfigKeys = getSubConfigKeys(schema);
  configPaths = configPaths.flatMap((configPath) =>
    composePathWithSubConfigKeys(configPath, subConfigKeys),
  );
  return {
    configPaths: toConfigPathsWithDeprecatedConfigPaths(
      configPaths,
      deprecatedConfigPathsCandidates,
    ),
    dataPaths: composePathWithSubConfigKeys(path, subConfigKeys),
  };
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
