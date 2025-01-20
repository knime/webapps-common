import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const DateControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateControl.vue"),
});

export const localDateRenderer = addLabel({
  name: "DateControl",
  control: DateControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.localDate)),
});
