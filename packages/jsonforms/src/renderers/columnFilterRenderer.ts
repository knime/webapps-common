import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const ColumnFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/ColumnFilter.vue"),
);

export const columnFilterRenderer = addLabel({
  name: "ColumnFilter",
  control: ColumnFilter,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.columnFilter)),
  ),
});
