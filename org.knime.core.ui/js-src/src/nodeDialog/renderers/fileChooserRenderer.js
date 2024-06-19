import { rankWith } from "@jsonforms/core";
import FileChooserInput from "../uiComponents/fileChooser/withTabs/FileChooserInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const hasFileChooserFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

export const fileChooserRenderer = {
  renderer: FileChooserInput,
  tester: rankWith(priorityRanks.default, hasFileChooserFormat),
};
