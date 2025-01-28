import { defineAsyncComponent } from "vue";
import { and, rankWith } from "@jsonforms/core";
import { isNumber } from "lodash-es";

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
    and(isNumber, hasFormat(inputFormats.number)),
  ),
});
