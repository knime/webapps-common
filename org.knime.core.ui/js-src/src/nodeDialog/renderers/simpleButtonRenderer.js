import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import SimpleButtonControl from "../uiComponents/SimpleButtonControl.vue";

export const simpleButtonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.simpleButton;

export const simpleButtonRenderer = {
  renderer: SimpleButtonControl,
  tester: rankWith(priorityRanks.default, simpleButtonTester),
};
