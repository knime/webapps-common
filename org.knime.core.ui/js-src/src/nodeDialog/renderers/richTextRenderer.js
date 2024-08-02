import { rankWith, isStringControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const RichTextControl = defineAsyncComponent(() =>
  import("../uiComponents/richTextControl/RichTextControl.vue"),
);

export const richTextTester = (uischema, _schema) => {
  const isString = isStringControl(uischema, _schema);
  return isString && uischema.options?.format === inputFormats.richTextInput;
};

export const richTextRenderer = {
  name: "RichTextControl",
  renderer: RichTextControl,
  tester: rankWith(priorityRanks.default, richTextTester),
};
