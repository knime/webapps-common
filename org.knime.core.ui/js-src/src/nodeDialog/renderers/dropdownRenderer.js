import { isControl, rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import { defineAsyncComponent } from "vue";

const DropdownControl = defineAsyncComponent({
  loader: () => import("../uiComponents/DropdownControl.vue"),
});

export const dropdownTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dropDown;

export const dropdownRenderer = {
  name: "DropdownControl",
  renderer: DropdownControl,
  tester: rankWith(priorityRanks.default, dropdownTester),
};
