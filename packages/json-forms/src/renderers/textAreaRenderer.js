import { defineAsyncComponent } from "vue";
import { isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const TextAreaControl = defineAsyncComponent(
  () => import("../uiComponents/TextAreaControl.vue"),
);

export const textAreaTester = (uischema) =>
  isStringControl && uischema.options?.format === inputFormats.textArea;

export const textAreaRenderer = {
  name: "TextAreaControl",
  renderer: TextAreaControl,
  tester: rankWith(priorityRanks.default, textAreaTester),
};
