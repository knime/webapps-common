import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const GridSelectionControl = defineAsyncComponent(
  () => import("../uiComponents/GridSelectionControl.vue"),
);

export const gridSelectionRenderer = withLabel()({
  name: "GridSelectionRenderer",
  control: GridSelectionControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.gridSelection)),
  ),
});
