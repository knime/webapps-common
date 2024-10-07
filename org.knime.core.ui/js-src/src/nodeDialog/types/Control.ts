import type { useJsonFormsControl } from "@jsonforms/vue";
import type { FlowSettings } from "../api/types";

type Control = ReturnType<typeof useJsonFormsControl>["control"] & {
  rootSchema: {
    hasNodeView?: boolean;
    flowVariablesMap?: Record<string, FlowSettings>;
  };
};

export default Control;
