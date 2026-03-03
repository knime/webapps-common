import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";

const LinkControl = defineAsyncComponent(
  () => import("../uiComponents/LinkControl.vue"),
);

export const linkRenderer = {
  name: "LinkRenderer",
  control: LinkControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.link)),
};
