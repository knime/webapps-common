import { and, hasType, rankWith, schemaMatches } from "@jsonforms/core";
import { inputFormats, priorityRanks } from "@/nodeDialog/constants";

import { defineAsyncComponent } from "vue";

const ComboBoxControl = defineAsyncComponent(() =>
  import("../uiComponents/ComboBoxControl.vue"),
);

const isArray = schemaMatches((s) => hasType(s, "array"));
const hasComboBoxFormat = (uischema, _schema) =>
  uischema.options?.format === inputFormats.comboBox;

export const comboBoxTester = and(isArray, hasComboBoxFormat);

export const comboBoxRenderer = {
  name: "ComboBoxControl",
  renderer: ComboBoxControl,
  tester: rankWith(priorityRanks.default, comboBoxTester),
};
