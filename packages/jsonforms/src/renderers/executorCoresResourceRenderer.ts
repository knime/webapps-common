import { defineAsyncComponent } from "vue";
import { and, isIntegerControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const ExecutorCoresControl = defineAsyncComponent(
  () => import("../uiComponents/resourceControls/ExecutorCoresControl.vue"),
);

export const executorCoresResourceRenderer = withLabel()({
  name: "ExecutorCoresControl",
  control: ExecutorCoresControl,
  tester: rankWith(
    priorityRanks.default,
    and(isIntegerControl, hasFormat(inputFormats.executorCoresResources)),
  ),
});
