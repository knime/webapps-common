import { and, isOneOfControl, rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import DockerImageDropdown from "../uiComponents/DockerImageDropdown.vue";

export const dockerImageDropdownRenderer = {
  control: DockerImageDropdown,
  name: "DockerImageDropdownRenderer",
  tester: rankWith(
    priorityRanks.default,
    and(isOneOfControl, hasFormat(inputFormats.dockerImageDropdown)),
  ),
};
