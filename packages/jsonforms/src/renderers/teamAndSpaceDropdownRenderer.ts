import { defineAsyncComponent } from "vue";
import {
  type UISchemaElement,
  and,
  isControl,
  rankWith,
} from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { withLabel } from "../higherOrderComponents/control/withLabel";

const TeamAndSpacesControl = defineAsyncComponent(
  () => import("../uiComponents/TeamAndSpacesControl.vue"),
);

export const isTeamAndSpacesDropdownControl = ({ options }: UISchemaElement) =>
  options?.format === inputFormats.teamAndSpacesDropdown &&
  options?.hasOwnProperty("possibleSpaces") &&
  options?.hasOwnProperty("possibleTeams");

export const teamAndSpacesDropdownRenderer = withLabel()({
  name: "TeamAndSpacesDropdownControl",
  control: TeamAndSpacesControl,
  tester: rankWith(
    priorityRanks.default,
    and(isControl, isTeamAndSpacesDropdownControl),
  ),
});
