import { rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import EditResetButton from "../layoutComponents/arrayLayout/EditResetButton.vue";

export const editResetButtonFormat = "editResetButton";
export const editResetButtonTester = (uischema, _schema) =>
  uischema.options?.format === editResetButtonFormat;

export const editResetButtonRenderer = {
  renderer: EditResetButton,
  tester: rankWith(priorityRanks.default, editResetButtonTester),
};
