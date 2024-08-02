import { isControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const DynamicValuesControl = defineAsyncComponent(() =>
  import("../uiComponents/dynamicValue/DynamicValuesControl.vue"),
);

export const dynamicValueTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dynamicValue;

export const dynamicValueRenderer = {
  name: "DynamicValueControl",
  renderer: DynamicValuesControl,
  tester: rankWith(priorityRanks.default, dynamicValueTester),
};
