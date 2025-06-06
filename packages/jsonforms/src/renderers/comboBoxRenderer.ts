import { defineAsyncComponent } from "vue";
import { and, hasType, rankWith, schemaMatches } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const ComboBoxControl = defineAsyncComponent(
  () => import("../uiComponents/ComboBoxControl.vue"),
);

const isArray = schemaMatches((s) => hasType(s, "array"));
const hasComboBoxFormat = hasFormat(inputFormats.comboBox);

export const comboBoxTester = and(isArray, hasComboBoxFormat);

export const comboBoxRenderer = withLabel()({
  name: "ComboBoxControl",
  control: ComboBoxControl,
  tester: rankWith(priorityRanks.default, comboBoxTester),
});
