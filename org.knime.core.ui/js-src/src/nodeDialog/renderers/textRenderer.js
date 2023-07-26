import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks } from "../constants";
import TextInput from "../uiComponents/TextInput.vue";

export const textTester = isStringControl;

export const textRenderer = {
  renderer: TextInput,
  tester: rankWith(priorityRanks.default, textTester),
};
