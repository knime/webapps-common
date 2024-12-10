import { defineAsyncComponent } from "vue";
import { or, rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const VerticalLayout = defineAsyncComponent(
  () => import("../layoutComponents/VerticalLayout.vue"),
);

export const verticalLayoutTester = or(uiTypeIs("VerticalLayout"));

export const verticalLayoutRenderer = {
  name: "VerticalLayout",
  renderer: VerticalLayout,
  tester: rankWith(priorityRanks.default, verticalLayoutTester),
};
