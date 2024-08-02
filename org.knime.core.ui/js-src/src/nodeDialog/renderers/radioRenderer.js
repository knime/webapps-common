import { rankWith, isOneOfControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const RadioControl = defineAsyncComponent(() =>
  import("../uiComponents/RadioControl.vue"),
);

export const radioTester = (uischema, schema) => {
  const isOneOf = isOneOfControl(uischema, schema);
  return isOneOf && uischema.options?.format === inputFormats.radio;
};

export const radioRenderer = {
  name: "RadioControl",
  renderer: RadioControl,
  tester: rankWith(priorityRanks.default, radioTester),
};
