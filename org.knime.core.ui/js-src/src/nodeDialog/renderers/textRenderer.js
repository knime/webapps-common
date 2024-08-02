import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const TextControl = defineAsyncComponent(() =>
  import("../uiComponents/TextControl.vue"),
);

export const textTester = isStringControl;

export const textRenderer = {
  name: "TextControl",
  renderer: TextControl,
  tester: rankWith(priorityRanks.default, textTester),
};
