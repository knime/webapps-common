import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const DateControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateControl.vue"),
});

export const localDateRenderer = withLabel({
  name: "DateControl",
  control: DateControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.localDate)),
});
