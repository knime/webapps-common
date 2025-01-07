import { defineAsyncComponent } from "vue";
import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const DynamicValuesControl = defineAsyncComponent(
  () => import("../uiComponents/dynamicValue/DynamicValuesControl.vue"),
);

export const dynamicValueTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dynamicValue;

export const dynamicValueRenderer = {
  name: "DynamicValueControl",
  renderer: DynamicValuesControl,
  tester: rankWith(priorityRanks.default, dynamicValueTester),
};
