import { defineAsyncComponent } from "vue";
import { and, hasType, rankWith, schemaMatches } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const MultiselectListBoxControl = defineAsyncComponent(
  () => import("../uiComponents/MultiSelectListBoxControl.vue"),
);

const isArray = schemaMatches((s) => hasType(s, "array"));
const hasMultiSelectListBoxFormat = hasFormat(inputFormats.multiSelectListBox);

export const multiSelectListBoxTester = and(
  isArray,
  hasMultiSelectListBoxFormat,
);

export const multiSelectListBoxRenderer = withLabel()({
  name: "MultiselectListBoxControl",
  control: MultiselectListBoxControl,
  tester: rankWith(priorityRanks.default, multiSelectListBoxTester),
});
