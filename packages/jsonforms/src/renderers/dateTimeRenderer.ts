import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const DateTimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateTimeControl.vue"),
});

export const dateTimeRenderer = withLabel()({
  name: "DateTimeControl",
  control: DateTimeControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.dateTime)),
});
