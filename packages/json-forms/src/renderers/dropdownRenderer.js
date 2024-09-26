import { isControl, rankWith } from "@jsonforms/core";
import DropdownControl from "../uiComponents/DropdownControl.vue";
import { priorityRanks, inputFormats } from "../constants";

export const dropdownTester = (uischema, _schema) =>
  isControl(uischema) && uischema.options?.format === inputFormats.dropDown;

export const dropdownRenderer = {
  renderer: DropdownControl,
  tester: rankWith(priorityRanks.default, dropdownTester),
};
