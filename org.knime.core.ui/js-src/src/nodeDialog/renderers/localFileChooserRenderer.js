import { rankWith, isStringControl, and } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const LocalFileChooserControl = defineAsyncComponent(() =>
  import("../uiComponents/fileChooser/local/LocalFileChooserControl.vue"),
);

export const localFileChooserTester = and(
  isStringControl,
  (uischema, _schema) =>
    uischema.options?.format === inputFormats.localFileChooser,
);

export const localFileChooserRenderer = {
  name: "LocalFileChooserControl",
  renderer: LocalFileChooserControl,
  tester: rankWith(priorityRanks.default, localFileChooserTester),
};
