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

/**
 * Note that there exists at least one data path in any case
 */
export const getDataPaths = ({
  path,
  subConfigKeys,
}: {
  path: string;
  subConfigKeys: string[] | undefined;
}) => {
  return subConfigKeys?.length
    ? subConfigKeys.map((subKey) => composePaths(path, subKey))
    : [path];
};

export const getConfigPaths = (params: {
  control: Control;
  path: string;
  subConfigKeys: string[] | undefined;
}): { configPath: string; deprecatedConfigPaths: string[] }[] => {
  const { path, control, subConfigKeys } = params;
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
  if (subConfigKeys?.length) {
    configPaths = configPaths.flatMap((configPath) =>
      subConfigKeys.map((subKey) => composePaths(configPath, subKey)),
    );
  }

  return toConfigPathsWithDeprecatedConfigPaths(
    configPaths,
    deprecatedConfigPathsCandidates,
  );
};

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
