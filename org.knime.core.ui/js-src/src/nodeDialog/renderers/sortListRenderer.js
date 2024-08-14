import { isControl, rankWith } from "@jsonforms/core";
import SortListControl from "../uiComponents/SortListControl.vue";
import { inputFormats, priorityRanks } from "../constants";

export const sortListTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.sortList;

export const sortListRenderer = {
  renderer: SortListControl,
  tester: rankWith(priorityRanks.default, sortListTester),
};
