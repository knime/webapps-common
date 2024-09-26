import { rankWith, isIntegerControl } from "@jsonforms/core";
import IntegerControl from "../uiComponents/IntegerControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const integerTester = (uischema, schema) => {
  const isInteger = isIntegerControl(uischema, schema);
  return isInteger && uischema.options?.format === inputFormats.integer;
};

export const integerRenderer = {
  renderer: IntegerControl,
  tester: rankWith(priorityRanks.default, integerTester),
};
