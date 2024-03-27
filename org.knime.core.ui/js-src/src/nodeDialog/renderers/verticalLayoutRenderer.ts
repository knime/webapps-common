import { rankWith, uiTypeIs, or } from "@jsonforms/core";
import VerticalLayout from "../layoutComponents/VerticalLayout.vue";
import { priorityRanks } from "../constants";

export const verticalLayoutTester = or(uiTypeIs("VerticalLayout"));

export const verticalLayoutRenderer = {
  renderer: VerticalLayout,
  tester: rankWith(priorityRanks.default, verticalLayoutTester),
};
