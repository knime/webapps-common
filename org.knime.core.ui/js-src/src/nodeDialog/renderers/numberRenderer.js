import { rankWith, isNumberControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const NumberControl = defineAsyncComponent(() =>
  import("../uiComponents/NumberControl.vue"),
);

export const numberTester = (uischema, schema) => {
  const isNumber = isNumberControl(uischema, schema);
  return isNumber && uischema.options?.format === inputFormats.number;
};

export const numberRenderer = {
  name: "NumberControl",
  renderer: NumberControl,
  tester: rankWith(priorityRanks.default, numberTester),
};
