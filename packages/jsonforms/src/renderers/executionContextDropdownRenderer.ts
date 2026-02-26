import { defineAsyncComponent } from "vue";
import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const ExecutionContextDropdown = defineAsyncComponent(
  () => import("../uiComponents/ExecutionContextDropdown.vue"),
);

export const executionContextDropdownRenderer = withLabel()({
  name: "ExecutionContextDropdownRenderer",
  control: ExecutionContextDropdown,
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.executionContextDropdown)),
  ),
});
