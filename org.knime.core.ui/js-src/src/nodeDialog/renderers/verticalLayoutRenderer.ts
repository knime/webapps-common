import { rankWith, uiTypeIs, or } from "@jsonforms/core";
import { priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const VerticalLayout = defineAsyncComponent(
  () => import("../layoutComponents/VerticalLayout.vue"),
);

export const verticalLayoutTester = or(uiTypeIs("VerticalLayout"));

export const verticalLayoutRenderer = {
  renderer: VerticalLayout,
  tester: rankWith(priorityRanks.default, verticalLayoutTester),
};
