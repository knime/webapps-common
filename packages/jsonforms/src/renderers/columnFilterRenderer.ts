import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const ColumnFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/ColumnFilter.vue"),
);

export const columnFilterRenderer = withLabel({
  name: "ColumnFilter",
  control: ColumnFilter,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.columnFilter)),
  ),
});
