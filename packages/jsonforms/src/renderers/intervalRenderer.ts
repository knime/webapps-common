import { defineAsyncComponent } from "vue";
import { type UISchemaElement, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const IntervalControl = defineAsyncComponent(
  () => import("../uiComponents/IntervalControl.vue"),
);

export const intervalTester = (uischema: UISchemaElement): boolean =>
  isControl(uischema) && uischema.options?.format === inputFormats.interval;

export const intervalRenderer = {
  name: "IntervalControl",
  renderer: IntervalControl,
  tester: rankWith(priorityRanks.default, intervalTester),
};
