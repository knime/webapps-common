import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/TimeControl.vue"),
});

export const localTimeRenderer = withLabel()({
  name: "TimeControl",
  control: TimeControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.localTime)),
});
