import { rankWith, isStringControl, and } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const LabeledLocalFileChooserControl = defineAsyncComponent(() =>
  import(
    "../uiComponents/fileChooser/withValueSwitch/LabeledLocalFileChooserControl.vue"
  ),
);

export const localFileChooserTester = and(
  isStringControl,
  (uischema, _schema) =>
    uischema.options?.format === inputFormats.localFileChooser,
);

export const localFileChooserRenderer = {
  name: "LocalFileChooserControl",
  renderer: LabeledLocalFileChooserControl,
  tester: rankWith(priorityRanks.default, localFileChooserTester),
};
