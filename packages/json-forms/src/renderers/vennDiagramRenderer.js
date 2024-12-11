import { defineAsyncComponent } from "vue";
import { rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const VennDiagramLayout = defineAsyncComponent(
  () => import("../layoutComponents/vennDiagram/VennDiagramLayout.vue"),
);

export const vennDiagramLayoutTester = uiTypeIs("VennDiagram");

export const vennDiagramLayoutRenderer = {
  name: "VennDiagramLayout",
  renderer: VennDiagramLayout,
  tester: rankWith(priorityRanks.default, vennDiagramLayoutTester),
};
