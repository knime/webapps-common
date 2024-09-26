import { rankWith, isBooleanControl } from "@jsonforms/core";
import CheckboxControl from "../uiComponents/CheckboxControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const checkboxTester = (uischema, schema) => {
  const isBoolean = isBooleanControl(uischema, schema);
  return isBoolean && uischema.options?.format === inputFormats.checkbox;
};

export const checkboxRenderer = {
  renderer: CheckboxControl,
  tester: rankWith(priorityRanks.default, checkboxTester),
};
