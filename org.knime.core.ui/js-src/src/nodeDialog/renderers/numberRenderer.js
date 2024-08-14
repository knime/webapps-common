import { rankWith, isNumberControl } from "@jsonforms/core";
import NumberControl from "../uiComponents/NumberControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const numberTester = (uischema, schema) => {
  const isNumber = isNumberControl(uischema, schema);
  return isNumber && uischema.options?.format === inputFormats.number;
};

export const numberRenderer = {
  renderer: NumberControl,
  tester: rankWith(priorityRanks.default, numberTester),
};
