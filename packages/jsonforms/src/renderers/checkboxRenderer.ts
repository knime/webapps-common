import { defineAsyncComponent } from "vue";
import { isBooleanControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { withErrorMessage } from "../higherOrderComponents/control/errorMessage/withErrorMessage";

const CheckboxControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxControl.vue"),
);

export const checkboxRenderer = withErrorMessage()({
  name: "CheckboxControl",
  control: CheckboxControl,
  tester: rankWith(priorityRanks.fallback, isBooleanControl),
});
