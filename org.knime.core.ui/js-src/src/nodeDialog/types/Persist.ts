/* eslint-disable no-use-before-define */
export type PersistSchema = ConfigInfo &
  (PersistTreeSchema | PersistLeafSchema | PersistArrayParentSchema);

type DeprecatedConfigs = { new: string[][]; deprecated: string[][] };

export interface ConfigInfo {
  configKey?: string;
  configPaths?: string[][];
  deprecatedConfigKeys?: DeprecatedConfigs[];
}

export interface PersistTreeSchema {
  type: "object";
  properties: {
    [key: string]: PersistSchema;
  };
}

export interface PersistLeafSchema {
  type?: "leaf";
}

export interface PersistArrayParentSchema {
  type: "array";
  items: PersistSchema;
}
