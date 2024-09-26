import { rankWith } from "@jsonforms/core";
import FileChooserControl from "../uiComponents/fileChooser/withTabs/FileChooserControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const hasFileChooserFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

export const fileChooserRenderer = {
  renderer: FileChooserControl,
  tester: rankWith(priorityRanks.default, hasFileChooserFormat),
};
