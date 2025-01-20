import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const NameFilter = defineAsyncComponent(
  () => import("../uiComponents/twinlist/NameFilter.vue"),
);

export const nameFilterRenderer = addLabel({
  name: "NameFilter",
  control: NameFilter,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.nameFilter)),
  ),
});
