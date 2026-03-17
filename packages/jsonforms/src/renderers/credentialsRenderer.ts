import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";
import { hasFormat } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";
import CredentialsControl from "../uiComponents/CredentialsControl.vue";

export const credentialsRenderer = withLabel()({
  name: "CredentialsRenderer",
  control: CredentialsControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.credentials)),
});
