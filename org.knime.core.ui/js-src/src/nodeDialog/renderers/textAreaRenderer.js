import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const TextAreaControl = defineAsyncComponent(() =>
  import("../uiComponents/TextAreaControl.vue"),
);

export const textAreaTester = (uischema) =>
  isStringControl && uischema.options?.format === inputFormats.textArea;

export const textAreaRenderer = {
  renderer: TextAreaControl,
  tester: rankWith(priorityRanks.default, textAreaTester),
};
