import { and, isControl, not, rankWith, schemaMatches } from "@jsonforms/core";
import { inputFormats, priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const TwinlistControl = defineAsyncComponent(() =>
  import("../uiComponents/twinlist/TwinlistControl.vue"),
);
const SimpleTwinlistControl = defineAsyncComponent(() =>
  import("../uiComponents/twinlist/SimpleTwinlistControl.vue"),
);

const isSelection = schemaMatches(
  (s) =>
    s.hasOwnProperty("properties") && s.properties.hasOwnProperty("selected"),
);

const isTwinlist = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.twinList;

export const twinlistTester = and(isTwinlist, isSelection);

export const twinlistRenderer = {
  renderer: TwinlistControl,
  tester: rankWith(priorityRanks.default, twinlistTester),
};

export const simpleTwinlistTester = and(isTwinlist, not(isSelection));

export const simpleTwinlistRenderer = {
  renderer: SimpleTwinlistControl,
  tester: rankWith(priorityRanks.default, simpleTwinlistTester),
};
