import { rankWith, isAnyOfControl } from "@jsonforms/core";
import CheckboxesInput from "../uiComponents/CheckboxesInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const checkboxesTester = (uischema, schema) => {
  const isAnyOf = isAnyOfControl(uischema, schema);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = {
  renderer: CheckboxesInput,
  tester: rankWith(priorityRanks.default, checkboxesTester),
};
