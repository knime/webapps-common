import { defineAsyncComponent } from "vue";
import { isAnyOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const CheckboxesControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxesControl.vue"),
);

export const checkboxesTester = (uischema, schema) => {
  const isAnyOf = isAnyOfControl(uischema, schema);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = {
  name: "CheckboxesControl",
  renderer: CheckboxesControl,
  tester: rankWith(priorityRanks.default, checkboxesTester),
};
