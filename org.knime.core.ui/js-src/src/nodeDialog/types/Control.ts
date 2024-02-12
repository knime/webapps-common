import type { useJsonFormsControl } from "@jsonforms/vue";
import type { FlowSettings } from "../api/types";
import type { ChoicesUiSchema } from "./ChoicesUiSchema";
import { FileChooserUiSchema } from "./FileChooserUiSchema";

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

export type Schema = (ArraySchema<Schema> | ObjectSchema<Schema> | {}) & {
  configKeys?: string[];
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
  uischema: ChoicesUiSchema | FileChooserUiSchema;
};

export default Control;
