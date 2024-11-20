import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import TextMessageControl from "../uiComponents/TextMessageControl.vue";

export const textMessageTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.textMessage;

export const textMessageRenderer = {
  renderer: TextMessageControl,
  tester: rankWith(priorityRanks.default, textMessageTester),
};
