import { isControl, rankWith } from "@jsonforms/core";
import DynamicValuesInput from "../uiComponents/DynamicValuesInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const dynamicValueTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dynamicValue;

export const dynamicValueRenderer = {
  renderer: DynamicValuesInput,
  tester: rankWith(priorityRanks.default, dynamicValueTester),
};
