import { defineAsyncComponent } from "vue";
import { rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";

const SettingsSubPanelLayout = defineAsyncComponent(
  () => import("../layoutComponents/SettingsSubPanelLayout.vue"),
);

const settingsSubPanelLayoutTester = uiTypeIs("SettingsSubPanelLayout");

export const settingsSubPanelLayoutRenderer = {
  name: "SettingsSubPanelLayout",
  layout: SettingsSubPanelLayout,
  tester: rankWith(priorityRanks.default, settingsSubPanelLayoutTester),
};
