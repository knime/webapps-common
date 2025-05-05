import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const SingleSelectListBoxControl = defineAsyncComponent(
  () => import("../uiComponents/SingleSelectListBoxControl.vue"),
);

const hasSingleSelectListBoxFormat = hasFormat(
  inputFormats.singleSelectListBox,
);

export const singleSelectListBoxTester = hasSingleSelectListBoxFormat;

export const singleSelectListBoxRenderer = withLabel()({
  name: "SingleSelectListBoxControl",
  control: SingleSelectListBoxControl,
  tester: rankWith(priorityRanks.default, singleSelectListBoxTester),
});
