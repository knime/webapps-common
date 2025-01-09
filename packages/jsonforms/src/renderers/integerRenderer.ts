import { defineAsyncComponent } from "vue";
import { and, isIntegerControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const IntegerControl = defineAsyncComponent(
  () => import("../uiComponents/IntegerControl.vue"),
);

export const integerRenderer = {
  name: "IntegerControl",
  control: addLabel(IntegerControl),
  tester: rankWith(
    priorityRanks.default,
    and(isIntegerControl, hasFormat(inputFormats.integer)),
  ),
};
