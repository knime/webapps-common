import { defineAsyncComponent } from "vue";
import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";

const RadioButtonsWithDescriptionControl = defineAsyncComponent(
  () => import("../uiComponents/RadioButtonsWithDescriptionControl.vue"),
);

export const radioWithDescriptionRenderer = {
  name: "RadioButtonsWithDescriptionControl",
  control: RadioButtonsWithDescriptionControl,
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.radioButtonsWithDescription)),
  ),
};
