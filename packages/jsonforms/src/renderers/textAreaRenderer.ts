import { defineAsyncComponent } from "vue";
import { and, isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const TextAreaControl = defineAsyncComponent(
  () => import("../uiComponents/TextAreaControl.vue"),
);

export const textAreaRenderer = {
  name: "TextAreaControl",
  control: addLabel(TextAreaControl),
  tester: rankWith(
    priorityRanks.default,
    and(isStringControl, hasFormat(inputFormats.textArea)),
  ),
};
