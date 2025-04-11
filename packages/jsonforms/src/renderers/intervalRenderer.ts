import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const IntervalControl = defineAsyncComponent(
  () => import("../uiComponents/IntervalControl.vue"),
);

export const intervalRenderer = withLabel()({
  name: "IntervalControl",
  control: IntervalControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.interval)),
  ),
});
