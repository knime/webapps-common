import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import TextControl from "../uiComponents/TextControl.vue";

export const textTester = isStringControl;

export const textRenderer = {
  renderer: TextControl,
  tester: rankWith(priorityRanks.default, textTester),
};
