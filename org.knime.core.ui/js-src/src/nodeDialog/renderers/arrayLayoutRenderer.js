import { isObjectArray, rankWith } from "@jsonforms/core";
import { priorityRanks } from "@/nodeDialog/constants";

import { defineAsyncComponent } from "vue";

const ArrayLayout = defineAsyncComponent(() =>
  import("@/nodeDialog/layoutComponents/arrayLayout/ArrayLayout.vue"),
);

export const arrayLayoutTester = isObjectArray;
export const arrayLayoutRenderer = {
  renderer: ArrayLayout,
  tester: rankWith(priorityRanks.default, arrayLayoutTester),
};
