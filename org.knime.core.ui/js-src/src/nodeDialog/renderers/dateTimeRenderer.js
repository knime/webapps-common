import { rankWith, isDateTimeControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import DateTimeInput from "../uiComponents/DateTimeInput.vue";

export const dateTimeRenderer = {
  renderer: DateTimeInput,
  tester: rankWith(priorityRanks.default, isDateTimeControl),
};
