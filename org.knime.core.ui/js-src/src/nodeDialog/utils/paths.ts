import Control, {
  Schema,
  isArraySchema,
  isObjectSchema,
} from "../types/Control";
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
  schema: Schema;
  segment: string;
}) => {
  const configKeys = schema.configKeys;
  if (typeof configKeys === "undefined" || !configKeys.length) {
    return [segment];
  }
  return configKeys;
};

const getSubConfigKeysRecursive = (
  schema: Schema,
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

  if (isArraySchema(schema) && schema.items) {
    return getSubConfigKeysRecursive(schema.items, prefix);
  } else if (isObjectSchema(schema) && schema.properties) {
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
export const getSubConfigKeys = (schema: Schema): string[][] => {
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
 * Data (JsonForms schema) paths are assembled by concatenating the given path with any potential sub config keys of the
 * given control's schema.
 * @see getSubConfigKeys for details on how subConfigKeys are determined.
 *
 * Note that there exists at least one data path in any case.
 */
export const getDataPaths = ({
  control,
  path,
}: {
  control: Control;
  path: string;
}) => {
  return composePathWithSubConfigKeys(path, getSubConfigKeys(control.schema));
};

/**
 * Config (persist) paths are assembled by traversing the control's root schema along the given path, replacing any
 * segments along the traversal with custom config keys, if such custom config keys are found in any of the segments'
 * schemas. Potential sub config keys are then appended to to the determined config paths.
 * @see getSubConfigKeys for details on how subConfigKeys are determined.
 */
export const getConfigPaths = (params: {
  control: Control;
  path: string;
}): { configPath: string; deprecatedConfigPaths: string[] }[] => {
  const { path, control } = params;
  const segments = path.split(".");
  let configPaths = [""];
  let schema: Schema = control.rootSchema;
  let deprecatedConfigPathsCandidates: DeprecatedConfigPathsCandidate[] = [];
  for (const segment of segments) {
    if (isArraySchema(schema)) {
      configPaths = configPaths.map((p) => composePaths(p, segment));
      schema = schema.items;
    } else if (isObjectSchema(schema) && schema.properties) {
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

  const subConfigKeys = getSubConfigKeys(control.schema);
  configPaths = configPaths.flatMap((configPath) =>
    composePathWithSubConfigKeys(configPath, subConfigKeys),
  );

  return toConfigPathsWithDeprecatedConfigPaths(
    configPaths,
    deprecatedConfigPathsCandidates,
  );
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
