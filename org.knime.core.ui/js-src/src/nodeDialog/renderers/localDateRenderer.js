import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const DateControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateControl.vue"),
});

export const hasLocalDateFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.localDate;

export const localDateRenderer = {
  name: "DateControl",
  renderer: DateControl,
  tester: rankWith(priorityRanks.default, hasLocalDateFormat),
};
