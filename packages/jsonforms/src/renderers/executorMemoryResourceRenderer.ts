import { defineAsyncComponent } from "vue";
import { and, isIntegerControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const ExecutorMemoryControl = defineAsyncComponent(
  () => import("../uiComponents/resourceControls/ExecutorMemoryControl.vue"),
);

export const executorMemoryResourceRenderer = withLabel()({
  name: "ExecutorMemoryControl",
  control: ExecutorMemoryControl,
  tester: rankWith(
    priorityRanks.default,
    and(isIntegerControl, hasFormat(inputFormats.executorMemoryResources)),
  ),
});
