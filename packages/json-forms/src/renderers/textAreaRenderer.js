import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import TextAreaControl from "../uiComponents/TextAreaControl.vue";

export const textAreaTester = (uischema) =>
  isStringControl && uischema.options?.format === inputFormats.textArea;

export const textAreaRenderer = {
  renderer: TextAreaControl,
  tester: rankWith(priorityRanks.default, textAreaTester),
};
