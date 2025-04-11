import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TypedStringFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/TypedStringFilter.vue"),
);

export const typedStringFilterRenderer = withLabel()({
  name: "TypedStringFilter",
  control: TypedStringFilter,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.typedStringFilter)),
  ),
});
