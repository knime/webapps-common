import { defineAsyncComponent } from "vue";
import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../../constants";
import { hasFormat } from "../../constants/inputFormats";

const ExecutionContextDropdown = defineAsyncComponent(
  () => import("./ExecutionContextDropdown.vue"),
);

export const executionContextDropdownRenderer = {
  name: "ExecutionContextDropdownRenderer",
  control: ExecutionContextDropdown,
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.executionContextDropdown)),
  ),
};
