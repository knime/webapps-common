import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";
import UsernameControl from "../uiComponents/UsernameControl.vue";

export const usernameRenderer = withLabel()({
  name: "UsernameRenderer",
  control: UsernameControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.username)),
});
