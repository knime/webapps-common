import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import ButtonControl from "../uiComponents/ButtonControl.vue";

export const buttonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.button;

export const buttonRenderer = {
  renderer: ButtonControl,
  tester: rankWith(priorityRanks.default, buttonTester),
};
