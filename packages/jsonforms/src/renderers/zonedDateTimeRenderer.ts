import { defineAsyncComponent } from "vue";
import { type UISchemaElement, rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { addLabel } from "../higherOrderComponents";

const ZonedDateTimeControl = defineAsyncComponent({
  loader: () => import("../uiComponents/ZonedDateTimeControl.vue"),
});

export const hasZonedDateTimeFormat = (uischema: UISchemaElement) =>
  uischema.options?.format === inputFormats.zonedDateTime;

export const zonedDateTimeRenderer = addLabel({
  name: "ZonedDateTimeControl",
  control: ZonedDateTimeControl,
  tester: rankWith(priorityRanks.default, hasZonedDateTimeFormat),
});
