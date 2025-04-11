import { defineAsyncComponent } from "vue";
import { type Tester, isAnyOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const CheckboxesControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxesControl.vue"),
);

export const checkboxesTester: Tester = (uischema, schema, context) => {
  const isAnyOf = isAnyOfControl(uischema, schema, context);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = withLabel()({
  name: "CheckboxesControl" as const,
  control: CheckboxesControl,
  tester: rankWith(priorityRanks.default, checkboxesTester),
});
