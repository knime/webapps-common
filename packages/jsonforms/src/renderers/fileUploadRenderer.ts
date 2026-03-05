import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const FileUploadControl = defineAsyncComponent(
  () => import("../uiComponents/FileUploadControl.vue"),
);

export const fileUploadRenderer = withLabel()({
  name: "FileUploadRenderer",
  control: FileUploadControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.fileUpload)),
  ),
});
