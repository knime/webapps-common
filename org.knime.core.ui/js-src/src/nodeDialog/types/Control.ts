import type { useJsonFormsControl } from "@jsonforms/vue";
import type { FlowSettings } from "../api/types";
import type { ChoicesUiSchema } from "./ChoicesUiSchema";

type Control = ReturnType<typeof useJsonFormsControl>["control"] & {
  rootSchema: {
    hasNodeView?: boolean;
    flowVariablesMap?: Record<string, FlowSettings>;
  };
  schema: {
    configKeys?: string[];
  };
  uischema: ChoicesUiSchema;
};

export default Control;
