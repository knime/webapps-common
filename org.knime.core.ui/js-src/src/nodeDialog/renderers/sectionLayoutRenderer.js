import { rankWith, uiTypeIs } from "@jsonforms/core";
import { priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const SectionLayout = defineAsyncComponent(() =>
  import("../layoutComponents/SectionLayout.vue"),
);

export const sectionLayoutTester = uiTypeIs("Section");

export const sectionLayoutRenderer = {
  renderer: SectionLayout,
  tester: rankWith(priorityRanks.default, sectionLayoutTester),
};
