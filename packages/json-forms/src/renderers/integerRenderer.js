import { defineAsyncComponent } from "vue";
import { isIntegerControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const IntegerControl = defineAsyncComponent(() =>
  import("../uiComponents/IntegerControl.vue"),
);

export const integerTester = (uischema, schema) => {
  const isInteger = isIntegerControl(uischema, schema);
  return isInteger && uischema.options?.format === inputFormats.integer;
};

export const integerRenderer = {
  name: "IntegerControl",
  renderer: IntegerControl,
  tester: rankWith(priorityRanks.default, integerTester),
};
