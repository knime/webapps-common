import { defineAsyncComponent } from "vue";
import {
  type UISchemaElement,
  and,
  isControl,
  rankWith,
} from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { addLabel } from "../higherOrderComponents";

const DateTimeFormatPickerControl = defineAsyncComponent(
  () => import("../uiComponents/DateTimeFormatPickerControl.vue"),
);

export const dateTimeFormatPickerTester = (uischema: UISchemaElement) => {
  return (
    isControl(uischema) &&
    uischema.options?.format === inputFormats.dateTimeFormat
  );
};

export const dateTimeFormatPickerRenderer = addLabel({
  name: "DateTimeFormatPickerControl",
  control: DateTimeFormatPickerControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, hasFormat(inputFormats.dateTimeFormat)),
  ),
});
