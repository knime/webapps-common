import type { useJsonFormsControl } from "@jsonforms/vue";

export type Control = ReturnType<
  typeof useJsonFormsControl
>["control"]["value"];
