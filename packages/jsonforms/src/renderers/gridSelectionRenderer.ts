import { and, isControl, rankWith } from "@jsonforms/core";

import { priorityRanks, inputFormats } from "../constants";
import { withLabel } from "../higherOrderComponents/control/withLabel";
import { defineAsyncComponent } from "vue";
import { hasFormat } from "../constants/inputFormats";

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
