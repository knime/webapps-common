import { defineAsyncComponent } from "vue";
import { rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const VerticalLayout = defineAsyncComponent(
  () => import("../layoutComponents/VerticalLayout.vue"),
);

export const verticalLayoutRenderer = {
  name: "VerticalLayout",
  layout: VerticalLayout,
  tester: rankWith(priorityRanks.default, uiTypeIs("VerticalLayout")),
};

export const verticalLayoutFallbackRenderer = {
  name: "VerticalLayout",
  layout: VerticalLayout,
  tester: rankWith(
    priorityRanks.fallback,
    // @ts-expect-error Argument of type 'undefined' is not assignable to parameter of type 'string'.
    // eslint-disable-next-line no-undefined
    uiTypeIs(undefined),
  ),
};
