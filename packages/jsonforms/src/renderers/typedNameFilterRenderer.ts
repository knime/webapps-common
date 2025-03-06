import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TypedNameFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/TypedNameFilter.vue"),
);

export const typedNameFilterRenderer = withLabel({
  name: "TypedNameFilter",
  control: TypedNameFilter,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.typedNameFilter)),
  ),
});
