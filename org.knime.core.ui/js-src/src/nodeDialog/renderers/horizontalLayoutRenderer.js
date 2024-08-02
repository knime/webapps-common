import { rankWith, uiTypeIs } from "@jsonforms/core";
import { priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const HorizontalLayout = defineAsyncComponent(() =>
  import("../layoutComponents/HorizontalLayout.vue"),
);

export const horizontalLayoutTester = uiTypeIs("HorizontalLayout");

export const horizontalLayoutRenderer = {
  name: "HorizontalLayout",
  renderer: HorizontalLayout,
  tester: rankWith(priorityRanks.default, horizontalLayoutTester),
};
