import { rankWith, isAnyOfControl } from "@jsonforms/core";
import CheckboxesControl from "../uiComponents/CheckboxesControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const checkboxesTester = (uischema, schema) => {
  const isAnyOf = isAnyOfControl(uischema, schema);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = {
  renderer: CheckboxesControl,
  tester: rankWith(priorityRanks.default, checkboxesTester),
};
