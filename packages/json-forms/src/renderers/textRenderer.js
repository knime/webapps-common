import { defineAsyncComponent } from "vue";
import { isStringControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const TextControl = defineAsyncComponent(() =>
  import("../uiComponents/TextControl.vue"),
);

export const textTester = isStringControl;

export const textRenderer = {
  name: "TextControl",
  renderer: TextControl,
  tester: rankWith(priorityRanks.default, textTester),
};
