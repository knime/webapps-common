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
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TwinlistControl = defineAsyncComponent(
  () => import("../uiComponents/twinlist/MultimodeTwinlistControl.vue"),
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

export const twinlistRenderer = withLabel()({
  name: "TwinlistControl",
  control: TwinlistControl,
  tester: rankWith(priorityRanks.default, twinlistTester),
});

export const simpleTwinlistTester = and(isTwinlist, not(isSelection));

export const simpleTwinlistRenderer = withLabel()({
  name: "SimpleTwinlistControl",
  control: SimpleTwinlistControl,
  tester: rankWith(priorityRanks.default, simpleTwinlistTester),
});
