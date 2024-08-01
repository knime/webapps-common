import { isControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const NameFilter = defineAsyncComponent(() =>
  import("../uiComponents/twinlist/NameFilter.vue"),
);

export const nameFilterTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.nameFilter;

export const nameFilterRenderer = {
  renderer: NameFilter,
  tester: rankWith(priorityRanks.default, nameFilterTester),
};
