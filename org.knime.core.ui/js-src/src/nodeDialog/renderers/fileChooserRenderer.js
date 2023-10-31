import { rankWith, isStringControl, and } from "@jsonforms/core";
import FileChooserInput from "../uiComponents/fileChooser/LocalFileChooserInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const fileChooserTester = and(
  isStringControl,
  (uischema, _schema) =>
    uischema.options?.format === inputFormats.localFileChooser,
);

export const fileChooserRenderer = {
  renderer: FileChooserInput,
  tester: rankWith(priorityRanks.default, fileChooserTester),
};
