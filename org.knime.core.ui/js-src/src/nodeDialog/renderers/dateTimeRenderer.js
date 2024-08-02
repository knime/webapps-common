import { rankWith, isDateTimeControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import { defineAsyncComponent } from "vue";

const DateTimeControl = defineAsyncComponent(() =>
  import("../uiComponents/DateTimeControl.vue"),
);

export const dateTimeRenderer = {
  name: "DateTimeControl",
  renderer: DateTimeControl,
  tester: rankWith(priorityRanks.default, isDateTimeControl),
};
