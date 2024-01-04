import type { useJsonFormsControl } from "@jsonforms/vue";
import type { FlowSettings } from "../api/types";
import type { ChoicesUiSchema } from "./ChoicesUiSchema";

export type SchemaWithConfigKeys = {
  configKeys?: string[];
  properties?: {
    [key: string]: SchemaWithConfigKeys;
  };
};

type Control = ReturnType<typeof useJsonFormsControl>["control"] & {
  rootSchema: {
    hasNodeView?: boolean;
    flowVariablesMap?: Record<string, FlowSettings>;
  } & SchemaWithConfigKeys;
  schema: SchemaWithConfigKeys;
  uischema: ChoicesUiSchema;
};

export default Control;
