import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const FileChooserControl = defineAsyncComponent(
  () => import("../uiComponents/fileChooser/withTabs/FileChooserControl.vue"),
);

export const hasFileChooserFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

export const fileChooserRenderer = {
  name: "FileChooserControl",
  renderer: FileChooserControl,
  tester: rankWith(priorityRanks.default, hasFileChooserFormat),
};
