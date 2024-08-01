import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import { defineAsyncComponent } from "vue";

const FileChooserControl = defineAsyncComponent(() =>
  import("../uiComponents/fileChooser/withTabs/FileChooserControl.vue"),
);

export const hasFileChooserFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.fileChooser;

export const fileChooserRenderer = {
  renderer: FileChooserControl,
  tester: rankWith(priorityRanks.default, hasFileChooserFormat),
};
