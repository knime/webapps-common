import { rankWith } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import ArrayLayoutItemCheckbox from "../layoutComponents/arrayLayout/ArrayLayoutItemCheckbox.vue";

export const elementCheckboxFormat = "elementCheckbox";
export const elementCheckboxTester = (uischema, _schema) =>
  uischema.options?.format === elementCheckboxFormat;

export const elementCheckboxRenderer = {
  renderer: ArrayLayoutItemCheckbox,
  tester: rankWith(priorityRanks.default, elementCheckboxTester),
};
