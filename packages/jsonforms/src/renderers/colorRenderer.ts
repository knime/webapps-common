import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const ColorControl = defineAsyncComponent(
  () => import("../uiComponents/ColorControl.vue"),
);

export const colorRenderer = withLabel()({
  name: "ColorControl",
  control: ColorControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.color)),
});
