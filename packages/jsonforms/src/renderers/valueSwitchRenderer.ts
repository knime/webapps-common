import { defineAsyncComponent } from "vue";
import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const ValueSwitchControl = defineAsyncComponent(
  () => import("../uiComponents/ValueSwitchControl.vue"),
);

export const valueSwitchRenderer = withLabel()({
  name: "ValueSwitchControl",
  control: ValueSwitchControl,
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.valueSwitch)),
  ),
});
