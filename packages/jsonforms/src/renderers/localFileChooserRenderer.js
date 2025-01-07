import { defineAsyncComponent } from "vue";
import { and, isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const LocalFileChooserControl = defineAsyncComponent(
  () => import("../uiComponents/fileChooser/local/LocalFileChooserControl.vue"),
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
