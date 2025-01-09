import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const ColumnSelect = defineAsyncComponent(
  () => import("../uiComponents/ColumnSelect.vue"),
);

export const columnSelectRenderer = {
  name: "ColumnSelect",
  control: ColumnSelect,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.columnSelect)),
  ),
};
