import { defineAsyncComponent } from "vue";
import { isBooleanControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const CheckboxControl = defineAsyncComponent(() =>
  import("../uiComponents/CheckboxControl.vue"),
);

export const checkboxTester = (uischema, schema) => {
  const isBoolean = isBooleanControl(uischema, schema);
  return isBoolean && uischema.options?.format === inputFormats.checkbox;
};

export const checkboxRenderer = {
  name: "CheckboxControl",
  renderer: CheckboxControl,
  tester: rankWith(priorityRanks.default, checkboxTester),
};
