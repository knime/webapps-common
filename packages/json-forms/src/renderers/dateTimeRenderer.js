import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const DateTimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateTimeControl.vue"),
});

export const hasDateTimeFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.dateTime;

export const dateTimeRenderer = {
  name: "DateTimeControl",
  renderer: DateTimeControl,
  tester: rankWith(priorityRanks.default, hasDateTimeFormat),
};
