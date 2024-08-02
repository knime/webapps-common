import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";

import { defineAsyncComponent } from "vue";

const SimpleButtonControl = defineAsyncComponent(() =>
  import("../uiComponents/SimpleButtonControl.vue"),
);

export const simpleButtonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.simpleButton;

export const simpleButtonRenderer = {
  name: "SimpleButtonControl",
  renderer: SimpleButtonControl,
  tester: rankWith(priorityRanks.default, simpleButtonTester),
};
