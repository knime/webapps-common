import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TimeframesControl = defineAsyncComponent(
  () => import("../uiComponents/TimeframesControl.vue"),
);

export const timeframesRenderer = withLabel()({
  name: "TimeframesRenderer",
  control: TimeframesControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.timeframes)),
  ),
});
