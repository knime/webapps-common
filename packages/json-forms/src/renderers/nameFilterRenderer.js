import { isControl, rankWith } from "@jsonforms/core";
import NameFilter from "../uiComponents/twinlist/NameFilter.vue";
import { priorityRanks, inputFormats } from "../constants";

export const nameFilterTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.nameFilter;

export const nameFilterRenderer = {
  renderer: NameFilter,
  tester: rankWith(priorityRanks.default, nameFilterTester),
};
