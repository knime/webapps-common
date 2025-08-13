import { defineAsyncComponent } from "vue";
import { and, hasType, rankWith, schemaMatches } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const MultiSelectDropdownControl = defineAsyncComponent(
  () => import("../uiComponents/MultiSelectDropdownControl.vue"),
);

const isArray = schemaMatches((s) => hasType(s, "array"));
const hasMultiSelectDrowdownFormat = hasFormat(
  inputFormats.multiSelectDropdown,
);

export const multiSelectDropdownTest = and(
  isArray,
  hasMultiSelectDrowdownFormat,
);

export const multiSelectDropdownRenderer = withLabel()({
  name: "MultiSelectDropdownControl",
  control: MultiSelectDropdownControl,
  tester: rankWith(priorityRanks.default, multiSelectDropdownTest),
});
