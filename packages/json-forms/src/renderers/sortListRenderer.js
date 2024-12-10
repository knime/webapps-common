import { defineAsyncComponent } from "vue";
import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const SortListControl = defineAsyncComponent(() =>
  import("../uiComponents/SortListControl.vue"),
);

export const sortListTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.sortList;

export const sortListRenderer = {
  name: "SortListControl",
  renderer: SortListControl,
  tester: rankWith(priorityRanks.default, sortListTester),
};
