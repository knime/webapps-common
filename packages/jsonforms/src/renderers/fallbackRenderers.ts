import { defineAsyncComponent } from "vue";
import {
  isAnyOfControl,
  isDateTimeControl,
  isIntegerControl,
  isNumberControl,
  isOneOfControl,
  rankWith,
} from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { addLabel } from "../higherOrderComponents/control/addLabel";
import type { VueControlRenderer } from "../higherOrderComponents/control/types";
import type { VueLayoutRenderer } from "../higherOrderComponents/layout/types";

import { checkboxRenderer } from "./checkboxRenderer";
import { dateTimeRenderer } from "./dateTimeRenderer";
import { integerRenderer } from "./integerRenderer";
import { numberRenderer } from "./numberRenderer";
import { textRenderer } from "./textRenderer";
import { verticalLayoutFallbackRenderer } from "./verticalLayoutRenderer";

const OneOfDropdown = defineAsyncComponent(
  () => import("../uiComponents/OneOfDropdown.vue"),
);
const AnyOfTwinlist = defineAsyncComponent(
  () => import("../uiComponents/twinlist/AnyOfTwinlist.vue"),
);

export const fallbackControlRenderers = {
  oneOfDropdownRenderer: {
    name: "OneOfDropdown",
    control: OneOfDropdown,
    tester: rankWith(priorityRanks.fallback, isOneOfControl),
  },
  dateTimeFallbackRenderer: {
    ...dateTimeRenderer,
    tester: rankWith(priorityRanks.fallback, isDateTimeControl),
  },
  textRenderer,
  checkboxRenderer,
  anyOfTwinlistRenderer: {
    name: "AnyOfTwinlist",
    control: addLabel(AnyOfTwinlist),
    tester: rankWith(priorityRanks.fallback, isAnyOfControl),
  },
  numberFallbackRenderer: {
    ...numberRenderer,
    tester: rankWith(priorityRanks.fallback, isNumberControl),
  },
  integerFallbackRenderer: {
    ...integerRenderer,
    tester: rankWith(priorityRanks.fallback, isIntegerControl),
  },
} satisfies Record<string, VueControlRenderer>;

export const fallbackLayoutRenderers = {
  verticalLayoutFallbackRenderer,
} satisfies Record<string, VueLayoutRenderer>;
