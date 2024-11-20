import { defineAsyncComponent } from "vue";
import { isObjectArray, rankWith } from "@jsonforms/core";

import { priorityRanks } from "@/nodeDialog/constants";

const ArrayLayout = defineAsyncComponent(() =>
  import("@/nodeDialog/layoutComponents/arrayLayout/ArrayLayout.vue"),
);

export const arrayLayoutTester = isObjectArray;
export const arrayLayoutRenderer = {
  renderer: ArrayLayout,
  name: "ArrayLayout",
  tester: rankWith(priorityRanks.default, arrayLayoutTester),
};
