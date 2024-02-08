import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import SimpleButtonInput from "../uiComponents/SimpleButtonInput.vue";

export const simpleButtonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.simpleButton;

export const simpleButtonRenderer = {
  renderer: SimpleButtonInput,
  tester: rankWith(priorityRanks.default, simpleButtonTester),
};
