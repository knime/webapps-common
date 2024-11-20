import { defineAsyncComponent } from "vue";
import { rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const SectionLayout = defineAsyncComponent(() =>
  import("../layoutComponents/SectionLayout.vue"),
);

export const sectionLayoutTester = uiTypeIs("Section");

export const sectionLayoutRenderer = {
  name: "SectionLayout",
  renderer: SectionLayout,
  tester: rankWith(priorityRanks.default, sectionLayoutTester),
};
