import { defineAsyncComponent } from "vue";
import { and, isControl, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const DateTimeFormatPickerControl = defineAsyncComponent(
  () => import("../uiComponents/DateTimeFormatPickerControl.vue"),
);

const DateTimeFormatPickerWithTypeControl = defineAsyncComponent(
  () => import("../uiComponents/DateTimeFormatPickerWithTypeControl.vue"),
);

export const dateTimeFormatPickerRenderer = withLabel()({
  name: "DateTimeFormatPickerControl",
  control: DateTimeFormatPickerControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.dateTimeFormat)),
  ),
});

export const dateTimeFormatPickerWithTypeRenderer = withLabel()({
  name: "DateTimeFormatPickerWithTypeControl",
  control: DateTimeFormatPickerWithTypeControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.dateTimeFormatWithType)),
  ),
});
