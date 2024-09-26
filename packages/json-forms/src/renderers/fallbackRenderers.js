import {
  rankWith,
  isNumberControl,
  isBooleanControl,
  isIntegerControl,
  isStringControl,
  isOneOfControl,
  isAnyOfControl,
  uiTypeIs,
} from "@jsonforms/core";
import { priorityRanks } from "../constants";
import { numberRenderer } from "./numberRenderer";
import { checkboxRenderer } from "./checkboxRenderer";
import { integerRenderer } from "./integerRenderer";
import OneOfDropdown from "../uiComponents/OneOfDropdown.vue";
import AnyOfTwinlist from "../uiComponents/twinlist/AnyOfTwinlist.vue";
import { textRenderer } from "./textRenderer";
import { verticalLayoutRenderer } from "./verticalLayoutRenderer";

export const fallbackRenderers = [
  {
    renderer: OneOfDropdown,
    tester: rankWith(priorityRanks.fallback, isOneOfControl),
  },
  {
    renderer: AnyOfTwinlist,
    tester: rankWith(priorityRanks.fallback, isAnyOfControl),
  },
  {
    ...numberRenderer,
    tester: rankWith(priorityRanks.fallback, isNumberControl),
  },
  {
    ...checkboxRenderer,
    tester: rankWith(priorityRanks.fallback, isBooleanControl),
  },
  {
    ...integerRenderer,
    tester: rankWith(priorityRanks.fallback, isIntegerControl),
  },
  {
    ...textRenderer,
    tester: rankWith(priorityRanks.fallback, isStringControl),
  },
  {
    ...verticalLayoutRenderer,
    // eslint-disable-next-line no-undefined
    tester: rankWith(priorityRanks.fallback, uiTypeIs(undefined)),
  },
];
