import { defineAsyncComponent } from "vue";
import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const ColumnSelect = defineAsyncComponent(() =>
  import("../uiComponents/ColumnSelect.vue"),
);

export const columnSelectTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.columnSelect;

export const columnSelectRenderer = {
  name: "ColumnSelect",
  renderer: ColumnSelect,
  tester: rankWith(priorityRanks.default, columnSelectTester),
};
