import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const SingleSelectControl = defineAsyncComponent(
  () => import("../uiComponents/SingleSelectControl.vue"),
);

export const singleSelectRenderer = withLabel()({
  name: "SingleSelectControl",
  control: SingleSelectControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.singleSelect)),
});
