import { defineAsyncComponent } from "vue";
import { and, isStringControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const RichTextControl = defineAsyncComponent(
  () => import("../uiComponents/richTextControl/RichTextControl.vue"),
);

export const richTextRenderer = withLabel(
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
