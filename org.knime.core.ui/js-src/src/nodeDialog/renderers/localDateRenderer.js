import { and, isDateTimeControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import { defineAsyncComponent } from "vue";

const DateControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateControl.vue"),
});

export const hasLocalTimeFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.localDate;

export const dateRenderer = {
  name: "DateControl",
  renderer: DateControl,
  tester: rankWith(
    priorityRanks.default,
    and(isDateTimeControl, hasLocalTimeFormat),
  ),
};
