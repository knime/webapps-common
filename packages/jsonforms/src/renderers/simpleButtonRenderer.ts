import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const SimpleButtonControl = defineAsyncComponent(
  () => import("../uiComponents/SimpleButtonControl.vue"),
);

export const simpleButtonRenderer = {
  name: "SimpleButtonControl",
  control: SimpleButtonControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.simpleButton)),
};
