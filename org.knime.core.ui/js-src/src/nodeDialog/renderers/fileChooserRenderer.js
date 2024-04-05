import { rankWith, and, not } from "@jsonforms/core";
import LabeledFileChooserInput from "../uiComponents/fileChooser/withValueSwitch/LabeledFileChooserInput.vue";
import FileChooserInput from "../uiComponents/fileChooser/withTabs/FileChooserInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const hasFileChooserFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

const isLabs = (uischema, _schema) => uischema.options?.isLabs === true;

export const fileChooserRenderer = {
  renderer: LabeledFileChooserInput,
  tester: rankWith(
    priorityRanks.default,
    and(hasFileChooserFormat, not(isLabs)),
  ),
};

export const fileChooserLabsRenderer = {
  renderer: FileChooserInput,
  tester: rankWith(priorityRanks.default, and(hasFileChooserFormat, isLabs)),
};
