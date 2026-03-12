import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const ColorPreviewControl = defineAsyncComponent(
  () => import("../uiComponents/ColorPreviewControl.vue"),
);

export const colorPreviewRenderer = {
  name: "ColorPreviewControl",
  control: ColorPreviewControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.colorPreview)),
};
