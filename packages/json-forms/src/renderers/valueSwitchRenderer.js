import { defineAsyncComponent } from "vue";
import { isOneOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const ValueSwitchControl = defineAsyncComponent(() =>
  import("../uiComponents/ValueSwitchControl.vue"),
);

export const valueSwitchTester = (uischema, schema) => {
  const isOneOf = isOneOfControl(uischema, schema);
  return isOneOf && uischema.options?.format === inputFormats.valueSwitch;
};

export const valueSwitchRenderer = {
  name: "ValueSwitchControl",
  renderer: ValueSwitchControl,
  tester: rankWith(priorityRanks.default, valueSwitchTester),
};
