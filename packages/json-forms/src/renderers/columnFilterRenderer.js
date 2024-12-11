import { defineAsyncComponent } from "vue";
import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const ColumnFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/ColumnFilter.vue"),
);

export const columnFilterTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.columnFilter;

export const columnFilterRenderer = {
  name: "ColumnFilter",
  renderer: ColumnFilter,
  tester: rankWith(priorityRanks.default, columnFilterTester),
};
