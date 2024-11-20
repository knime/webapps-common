import { defineAsyncComponent } from "vue";
import { isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const NameFilter = defineAsyncComponent(() =>
  import("../uiComponents/twinlist/NameFilter.vue"),
);

export const nameFilterTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.nameFilter;

export const nameFilterRenderer = {
  name: "NameFilter",
  renderer: NameFilter,
  tester: rankWith(priorityRanks.default, nameFilterTester),
};
