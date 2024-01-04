import Control, { SchemaWithConfigKeys } from "../types/Control";

const composePaths = (path1: string, path2: string) => {
  if (path1 === "") {
    return path2;
  }
  return `${path1}.${path2}`;
};

const getNextSubPaths = ({
  parentPath,
  schema,
  segment,
}: {
  parentPath: string;
  schema: SchemaWithConfigKeys;
  segment: string;
}) => {
  const configKeys = schema.configKeys;
  if (typeof configKeys === "undefined" || !configKeys.length) {
    return [composePaths(parentPath, segment)];
  }
  return configKeys.map((key) => composePaths(parentPath, key));
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
  return subConfigKeys && subConfigKeys.length
    ? subConfigKeys.map((subKey) => composePaths(path, subKey))
    : [path];
};

export const getConfigPaths = (params: {
  control: Control;
  path: string;
  subConfigKeys: string[] | undefined;
}): string[] => {
  const { path, control, subConfigKeys } = params;
  const segments = path.split(".");
  let configPaths = [""];
  let schema = control.rootSchema;
  for (const segment of segments) {
    /**
     * properties is guaranteed to exist here, since the schema is the schema of the given subpath
     */
    schema = schema.properties![segment];
    configPaths = configPaths.flatMap((parentPath) =>
      getNextSubPaths({ parentPath, schema, segment }),
    );
  }
  return subConfigKeys?.length //
    ? configPaths.flatMap((configPath) =>
        subConfigKeys.map((subKey) => composePaths(configPath, subKey)),
      ) //
    : configPaths;
};
