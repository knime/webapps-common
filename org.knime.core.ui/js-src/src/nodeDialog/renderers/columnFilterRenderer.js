import { isControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const ColumnFilter = defineAsyncComponent(() =>
  import("../uiComponents/twinlist/ColumnFilter.vue"),
);

export const columnFilterTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.columnFilter;

export const columnFilterRenderer = {
  renderer: ColumnFilter,
  tester: rankWith(priorityRanks.default, columnFilterTester),
};
