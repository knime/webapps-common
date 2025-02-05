import { defineAsyncComponent } from "vue";
import { and, isNumberControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const NumberControl = defineAsyncComponent(
  () => import("../uiComponents/NumberControl.vue"),
);

export const numberRenderer = withLabel({
  name: "NumberControl",
  control: NumberControl,
  tester: rankWith(
    priorityRanks.default,
    and(isNumberControl, hasFormat(inputFormats.number)),
  ),
});
