import { defineAsyncComponent } from "vue";
import { isBooleanControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const CheckboxControl = defineAsyncComponent(
  () => import("../uiComponents/CheckboxControl.vue"),
);

export const checkboxRenderer = {
  name: "CheckboxControl",
  control: CheckboxControl,
  tester: rankWith(priorityRanks.fallback, isBooleanControl),
};
