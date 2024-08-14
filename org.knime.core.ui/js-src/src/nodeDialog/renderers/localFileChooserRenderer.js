import { rankWith, isStringControl, and } from "@jsonforms/core";
import LabeledLocalFileChooserControl from "../uiComponents/fileChooser/withValueSwitch/LabeledLocalFileChooserControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const localFileChooserTester = and(
  isStringControl,
  (uischema, _schema) =>
    uischema.options?.format === inputFormats.localFileChooser,
);

export const localFileChooserRenderer = {
  renderer: LabeledLocalFileChooserControl,
  tester: rankWith(priorityRanks.default, localFileChooserTester),
};
