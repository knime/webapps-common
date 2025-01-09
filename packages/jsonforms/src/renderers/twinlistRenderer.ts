import { defineAsyncComponent } from "vue";
import {
  type Tester,
  and,
  isControl,
  not,
  rankWith,
  schemaMatches,
} from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { addLabel } from "../higherOrderComponents/control/addLabel";

const TwinlistControl = defineAsyncComponent(
  () => import("../uiComponents/twinlist/TwinlistControl.vue"),
);
const SimpleTwinlistControl = defineAsyncComponent(
  () => import("../uiComponents/twinlist/SimpleTwinlistControl.vue"),
);

const isSelection: Tester = schemaMatches((s) =>
  Boolean(
    s.hasOwnProperty("properties") && s.properties?.hasOwnProperty("selected"),
  ),
);

const isTwinlist: Tester = (uischema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.twinList;

export const twinlistTester = and(isTwinlist, isSelection);

export const twinlistRenderer = {
  name: "TwinlistControl",
  control: addLabel(TwinlistControl),
  tester: rankWith(priorityRanks.default, twinlistTester),
};

export const simpleTwinlistTester = and(isTwinlist, not(isSelection));

export const simpleTwinlistRenderer = {
  name: "SimpleTwinlistControl",
  control: addLabel(SimpleTwinlistControl),
  tester: rankWith(priorityRanks.default, simpleTwinlistTester),
};
