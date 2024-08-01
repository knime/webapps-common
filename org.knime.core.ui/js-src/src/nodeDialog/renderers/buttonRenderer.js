import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import { defineAsyncComponent } from "vue";

const ButtonControl = defineAsyncComponent(() =>
  import("../uiComponents/ButtonControl.vue"),
);

export const buttonTester = (uischema, _schema) =>
  uischema.options?.format === inputFormats.button;

export const buttonRenderer = {
  renderer: ButtonControl,
  tester: rankWith(priorityRanks.default, buttonTester),
};
