import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const SimpleButtonControl = defineAsyncComponent(
  () => import("../uiComponents/SimpleButtonControl.vue"),
);

export const simpleButtonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.simpleButton;

export const simpleButtonRenderer = {
  name: "SimpleButtonControl",
  renderer: SimpleButtonControl,
  tester: rankWith(priorityRanks.default, simpleButtonTester),
};
