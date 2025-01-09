import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const DropdownControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DropdownControl.vue"),
});

export const dropdownRenderer = {
  name: "DropdownControl",
  control: DropdownControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.dropDown)),
  ),
};
