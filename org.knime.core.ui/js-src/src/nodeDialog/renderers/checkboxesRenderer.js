import { rankWith, isAnyOfControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const CheckboxesControl = defineAsyncComponent(() =>
  import("../uiComponents/CheckboxesControl.vue"),
);

export const checkboxesTester = (uischema, schema) => {
  const isAnyOf = isAnyOfControl(uischema, schema);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = {
  renderer: CheckboxesControl,
  tester: rankWith(priorityRanks.default, checkboxesTester),
};
