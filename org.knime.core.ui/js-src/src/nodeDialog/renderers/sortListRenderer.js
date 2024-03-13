import { isControl, rankWith } from "@jsonforms/core";
import SortListInput from "../uiComponents/SortListInput.vue";
import { inputFormats, priorityRanks } from "../constants";

export const sortListTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.sortList;

export const sortListRenderer = {
  renderer: SortListInput,
  tester: rankWith(priorityRanks.default, sortListTester),
};
