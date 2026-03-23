import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import PasswordControl from "../uiComponents/PasswordControl.vue";

export const passwordRenderer = {
  name: "PasswordRenderer",
  control: PasswordControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.password)),
};
