import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const IntervalControl = defineAsyncComponent(
  () => import("../uiComponents/IntervalControl.vue"),
);

export const intervalRenderer = addLabel({
  name: "IntervalControl",
  control: IntervalControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.interval)),
  ),
});
