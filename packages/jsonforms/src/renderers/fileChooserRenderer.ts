import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const FileChooserControl = defineAsyncComponent(
  () => import("../uiComponents/FileChooserControl.vue"),
);

export const fileChooserRenderer = withLabel()({
  name: "FileChooserRenderer",
  control: FileChooserControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.fileChooser)),
  ),
});
