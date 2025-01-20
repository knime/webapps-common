import { defineAsyncComponent } from "vue";
import { and, isDateTimeControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const TimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/TimeControl.vue"),
});

export const localTimeRenderer = addLabel({
  name: "TimeControl",
  control: TimeControl,
  tester: rankWith(
    priorityRanks.default,
    and(isDateTimeControl, hasFormat(inputFormats.localTime)),
  ),
});
