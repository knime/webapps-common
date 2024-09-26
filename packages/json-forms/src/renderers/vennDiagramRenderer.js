import { rankWith, uiTypeIs } from "@jsonforms/core";
import VennDiagramLayout from "../layoutComponents/vennDiagram/VennDiagramLayout.vue";
import { priorityRanks } from "../constants";

export const vennDiagramLayoutTester = uiTypeIs("VennDiagram");

export const vennDiagramLayoutRenderer = {
  renderer: VennDiagramLayout,
  tester: rankWith(priorityRanks.default, vennDiagramLayoutTester),
};
