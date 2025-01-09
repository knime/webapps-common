import { defineAsyncComponent } from "vue";
import { type Tester, isAnyOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const CheckboxesControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxesControl.vue"),
);

export const checkboxesTester: Tester = (uischema, schema, context) => {
  const isAnyOf = isAnyOfControl(uischema, schema, context);
  return isAnyOf && uischema.options?.format === inputFormats.checkboxes;
};

export const checkboxesRenderer = {
  name: "CheckboxesControl" as const,
  control: addLabel(CheckboxesControl),
  tester: rankWith(priorityRanks.default, checkboxesTester),
};
