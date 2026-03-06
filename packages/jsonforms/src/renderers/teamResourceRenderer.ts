import { defineAsyncComponent } from "vue";
import { and, isIntegerControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";

const TeamResourceControl = defineAsyncComponent(
  () => import("../uiComponents/resourceControls/TeamResourceControl.vue"),
);

export const teamResourceRenderer = withLabel()({
  name: "TeamResourceControl",
  control: TeamResourceControl,
  tester: rankWith(
    priorityRanks.default,
    and(isIntegerControl, hasFormat(inputFormats.teamResources)),
  ),
});
