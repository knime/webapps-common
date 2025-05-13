import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const CheckboxesControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxesControl.vue"),
);

export const checkboxesRenderer = withLabel()({
  name: "CheckboxesControl" as const,
  control: CheckboxesControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.checkboxes)),
});
