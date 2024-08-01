import { rankWith, uiTypeIs } from "@jsonforms/core";
import { priorityRanks } from "../constants";

import { defineAsyncComponent } from "vue";

const VennDiagramLayout = defineAsyncComponent(() =>
  import("../layoutComponents/vennDiagram/VennDiagramLayout.vue"),
);

export const vennDiagramLayoutTester = uiTypeIs("VennDiagram");

export const vennDiagramLayoutRenderer = {
  renderer: VennDiagramLayout,
  tester: rankWith(priorityRanks.default, vennDiagramLayoutTester),
};
