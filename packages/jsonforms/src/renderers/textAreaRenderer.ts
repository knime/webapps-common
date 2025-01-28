import { defineAsyncComponent } from "vue";
import { and, isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TextAreaControl = defineAsyncComponent(
  () => import("../uiComponents/TextAreaControl.vue"),
);

export const textAreaRenderer = withLabel({
  name: "TextAreaControl",
  control: TextAreaControl,
  tester: rankWith(
    priorityRanks.default,
    and(isStringControl, hasFormat(inputFormats.textArea)),
  ),
});
