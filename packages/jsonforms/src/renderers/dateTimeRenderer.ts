import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const DateTimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DateTimeControl.vue"),
});

export const dateTimeRenderer = {
  name: "DateTimeControl",
  control: addLabel(DateTimeControl),
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.dateTime)),
};
