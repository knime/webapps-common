import { rankWith } from "@jsonforms/core";
import LabeledFileChooserInput from "../uiComponents/fileChooser/LabeledFileChooserInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const fileChooserTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

export const fileChooserRenderer = {
  renderer: LabeledFileChooserInput,
  tester: rankWith(priorityRanks.default, fileChooserTester),
};
