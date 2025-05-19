import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import TextMessageControl from "../uiComponents/TextMessageControl.vue";

export const textMessageRenderer = {
  name: "TextMessageControl",
  control: TextMessageControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.textMessage)),
};
