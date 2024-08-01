import { rankWith, isBooleanControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const CheckboxControl = defineAsyncComponent(() =>
  import("../uiComponents/CheckboxControl.vue"),
);

export const checkboxTester = (uischema, schema) => {
  const isBoolean = isBooleanControl(uischema, schema);
  return isBoolean && uischema.options?.format === inputFormats.checkbox;
};

export const checkboxRenderer = {
  renderer: CheckboxControl,
  tester: rankWith(priorityRanks.default, checkboxTester),
};
