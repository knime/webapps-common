import { defineAsyncComponent } from "vue";
import { and, rankWith } from "@jsonforms/core";
import { isNumber } from "lodash-es";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const NumberControl = defineAsyncComponent(
  () => import("../uiComponents/NumberControl.vue"),
);

export const numberRenderer = {
  name: "NumberControl",
  control: addLabel(NumberControl),
  tester: rankWith(
    priorityRanks.default,
    and(isNumber, hasFormat(inputFormats.number)),
  ),
};
