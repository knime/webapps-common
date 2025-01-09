import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const SortListControl = defineAsyncComponent(
  () => import("../uiComponents/SortListControl.vue"),
);

export const sortListRenderer = {
  name: "SortListControl",
  control: SortListControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.sortList)),
  ),
};
