import { rankWith, isDateTimeControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import DateTimeControl from "../uiComponents/DateTimeControl.vue";

export const dateTimeRenderer = {
  renderer: DateTimeControl,
  tester: rankWith(priorityRanks.default, isDateTimeControl),
};
