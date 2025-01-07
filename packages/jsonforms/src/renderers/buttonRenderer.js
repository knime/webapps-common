import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const ButtonControl = defineAsyncComponent(
  () => import("../uiComponents/ButtonControl.vue"),
);

export const buttonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.button;

export const buttonRenderer = {
  name: "ButtonControl",
  renderer: ButtonControl,
  tester: rankWith(priorityRanks.default, buttonTester),
};
