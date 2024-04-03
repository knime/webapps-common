import { rankWith, isStringControl, and } from "@jsonforms/core";
import LabeledLocalFileChooserInput from "../uiComponents/fileChooser/withValueSwitch/LabeledLocalFileChooserInput.vue";
import { priorityRanks, inputFormats } from "../constants";

export const localFileChooserTester = and(
  isStringControl,
  (uischema, _schema) =>
    uischema.options?.format === inputFormats.localFileChooser,
);

export const localFileChooserRenderer = {
  renderer: LabeledLocalFileChooserInput,
  tester: rankWith(priorityRanks.default, localFileChooserTester),
};
