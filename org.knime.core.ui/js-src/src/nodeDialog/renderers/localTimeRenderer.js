import { and, isDateTimeControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import { defineAsyncComponent } from "vue";

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
