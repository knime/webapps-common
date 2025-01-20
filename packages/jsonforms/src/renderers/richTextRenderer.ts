import { defineAsyncComponent } from "vue";
import { and, isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const RichTextControl = defineAsyncComponent(
  () => import("../uiComponents/richTextControl/RichTextControl.vue"),
);

export const richTextRenderer = addLabel(
  {
    name: "RichTextControl",
    control: RichTextControl,
    tester: rankWith(
      priorityRanks.default,
      and(isStringControl, hasFormat(inputFormats.richTextInput)),
    ),
  },
  { fill: true },
);
