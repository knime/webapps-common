import { defineAsyncComponent } from "vue";
import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const RadioControl = defineAsyncComponent(
  () => import("../uiComponents/RadioControl.vue"),
);

export const radioRenderer = {
  name: "RadioControl",
  control: addLabel(RadioControl),
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.radio)),
  ),
};
