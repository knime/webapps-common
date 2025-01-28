import { defineAsyncComponent } from "vue";
import { and, isIntegerControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const IntegerControl = defineAsyncComponent(
  () => import("../uiComponents/IntegerControl.vue"),
);

export const integerRenderer = withLabel({
  name: "IntegerControl",
  control: IntegerControl,
  tester: rankWith(
    priorityRanks.default,
    and(isIntegerControl, hasFormat(inputFormats.integer)),
  ),
});
