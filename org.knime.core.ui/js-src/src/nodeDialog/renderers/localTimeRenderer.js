import { defineAsyncComponent } from "vue";
import { and, isDateTimeControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const TimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/TimeControl.vue"),
});

export const hasLocalTimeFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.localTime;

export const timeRenderer = {
  name: "TimeControl",
  renderer: TimeControl,
  tester: rankWith(
    priorityRanks.default,
    and(isDateTimeControl, hasLocalTimeFormat),
  ),
};
