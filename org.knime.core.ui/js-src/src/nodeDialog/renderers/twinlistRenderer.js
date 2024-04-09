import { and, isControl, not, rankWith, schemaMatches } from "@jsonforms/core";
import TwinlistInput from "../uiComponents/twinlist/TwinlistInput.vue";
import SimpleTwinlistInput from "../uiComponents/twinlist/SimpleTwinlistInput.vue";

import { inputFormats, priorityRanks } from "../constants";

const isSelection = schemaMatches(
  (s) =>
    s.hasOwnProperty("properties") && s.properties.hasOwnProperty("selected"),
);

const isTwinlist = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.twinList;

export const twinlistTester = and(isTwinlist, isSelection);

export const twinlistRenderer = {
  renderer: TwinlistInput,
  tester: rankWith(priorityRanks.default, twinlistTester),
};

export const simpleTwinlistTester = and(isTwinlist, not(isSelection));

export const simpleTwinlistRenderer = {
  renderer: SimpleTwinlistInput,
  tester: rankWith(priorityRanks.default, simpleTwinlistTester),
};
