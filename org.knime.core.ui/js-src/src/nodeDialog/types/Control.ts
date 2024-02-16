import type { useJsonFormsControl } from "@jsonforms/vue";
import type { FlowSettings } from "../api/types";

export interface ObjectSchema<S> {
  type: "object";
  properties: {
    [key: string]: S;
  };
}

export interface ArraySchema<S> {
  type: "array";
  items: S;
}

type DeprecatedConfigs = { new: string[][]; deprecated: string[][] };

export type Schema = (ArraySchema<Schema> | ObjectSchema<Schema> | {}) & {
  configKeys?: string[];
  deprecatedConfigKeys?: DeprecatedConfigs[];
};

export const isArraySchema = (schema: any): schema is ArraySchema<Schema> => {
  return schema.type === "array";
};

export const isObjectSchema = (schema: any): schema is ObjectSchema<Schema> => {
  return schema.type === "object";
};

type Control = ReturnType<typeof useJsonFormsControl>["control"] & {
  rootSchema: {
    hasNodeView?: boolean;
    flowVariablesMap?: Record<string, FlowSettings>;
  } & Schema;
  schema: Schema;
};

export default Control;
