import { defineAsyncComponent } from "vue";
import { isStringControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const TextControl = defineAsyncComponent(
  () => import("../uiComponents/TextControl.vue"),
);

export const textRenderer = {
  name: "TextControl",
  control: TextControl,
  tester: rankWith(priorityRanks.fallback, isStringControl),
};
