import { PersistSchema } from "@/nodeDialog/types/Persist";

export const createPersistSchema = (params: {
  path: string;
  configKeys?: string[];
  subConfigKeys?: string[][];
  leaf?: PersistSchema;
}): PersistSchema => {
  const { path, configKeys, subConfigKeys, leaf } = params;
  const persistSchema: any = {};
  let currentPersistSchema = persistSchema;
  const segments = path.split(".");
  for (let i = 0; i < segments.length; i++) {
    const nextSchema = i === segments.length - 1 && leaf ? leaf : {};
    currentPersistSchema.type = "object";
    currentPersistSchema.properties = { [segments[i]]: nextSchema };
    currentPersistSchema = nextSchema;
  }
  if (configKeys) {
    currentPersistSchema.configKeys = configKeys;
  }
  if (subConfigKeys) {
    currentPersistSchema.subConfigKeys = subConfigKeys;
  }
  return persistSchema;
};
