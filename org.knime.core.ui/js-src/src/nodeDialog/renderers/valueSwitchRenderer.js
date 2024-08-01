import { rankWith, isOneOfControl } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const ValueSwitchControl = defineAsyncComponent(() =>
  import("../uiComponents/ValueSwitchControl.vue"),
);

export const valueSwitchTester = (uischema, schema) => {
  const isOneOf = isOneOfControl(uischema, schema);
  return isOneOf && uischema.options?.format === inputFormats.valueSwitch;
};

export const valueSwitchRenderer = {
  renderer: ValueSwitchControl,
  tester: rankWith(priorityRanks.default, valueSwitchTester),
};
