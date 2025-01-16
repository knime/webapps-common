import { defineAsyncComponent } from "vue";
import {
  isAnyOfControl,
  isBooleanControl,
  isDateTimeControl,
  isIntegerControl,
  isNumberControl,
  isOneOfControl,
  isStringControl,
  rankWith,
  uiTypeIs,
} from "@jsonforms/core";

import { priorityRanks } from "../constants";
import DateTimeControl from "../uiComponents/DateTimeControl.vue";

import { checkboxRenderer } from "./checkboxRenderer";
import { integerRenderer } from "./integerRenderer";
import { numberRenderer } from "./numberRenderer";
import { textRenderer } from "./textRenderer";
import { verticalLayoutRenderer } from "./verticalLayoutRenderer";

const OneOfDropdown = defineAsyncComponent(
  () => import("../uiComponents/OneOfDropdown.vue"),
);
const AnyOfTwinlist = defineAsyncComponent(
  () => import("../uiComponents/twinlist/AnyOfTwinlist.vue"),
);

export const fallbackRenderers = [
  {
    name: "OneOfDropdown",
    renderer: OneOfDropdown,
    tester: rankWith(priorityRanks.fallback, isOneOfControl),
  },
  {
    name: "AnyOfTwinlist",
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
    name: "DateTimeControl",
    renderer: DateTimeControl,
    tester: rankWith(priorityRanks.fallback, isDateTimeControl),
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
