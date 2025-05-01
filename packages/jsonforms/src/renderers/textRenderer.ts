import { defineAsyncComponent } from "vue";
import { isStringControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { withLabel } from "../higherOrderComponents";

const TextControl = defineAsyncComponent(
  () => import("../uiComponents/TextControl.vue"),
);

export const textRenderer = withLabel()({
  name: "TextControl",
  control: TextControl,
  tester: rankWith(priorityRanks.fallback, isStringControl),
});
