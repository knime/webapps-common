import { isControl, rankWith } from "@jsonforms/core";
import TextMessageControl from "../uiComponents/TextMessageControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const textMessageTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.textMessage;

export const textMessageRenderer = {
  renderer: TextMessageControl,
  tester: rankWith(priorityRanks.default, textMessageTester),
};
