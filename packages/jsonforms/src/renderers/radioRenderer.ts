import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const RadioControl = defineAsyncComponent(
  () => import("../uiComponents/RadioControl.vue"),
);

export const radioRenderer = withLabel()({
  name: "RadioControl",
  control: RadioControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.radio)),
});
