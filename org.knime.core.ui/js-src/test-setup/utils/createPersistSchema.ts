import type { PersistSchema } from "@/nodeDialog/types/Persist";

export const createPersistSchema = (params: {
  path: string;
  configPaths?: string[][];
  configKey?: string;
  leaf?: PersistSchema;
}): PersistSchema => {
  const { path, configPaths, configKey, leaf } = params;
  const persistSchema: any = {};
  let currentPersistSchema = persistSchema;
  const segments = path.split(".");
  for (let i = 0; i < segments.length; i++) {
    const nextSchema = i === segments.length - 1 && leaf ? leaf : {};
    currentPersistSchema.type = "object";
    currentPersistSchema.properties = { [segments[i]]: nextSchema };
    currentPersistSchema = nextSchema;
  }
  if (configPaths) {
    currentPersistSchema.configPaths = configPaths;
  }
  if (configKey) {
    currentPersistSchema.configKey = configKey;
  }
  return persistSchema;
};
