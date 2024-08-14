import { isControl, rankWith } from "@jsonforms/core";
import DynamicValuesControl from "../uiComponents/dynamicValue/DynamicValuesControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const dynamicValueTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dynamicValue;

export const dynamicValueRenderer = {
  renderer: DynamicValuesControl,
  tester: rankWith(priorityRanks.default, dynamicValueTester),
};
