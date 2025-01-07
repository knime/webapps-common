import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const LegacyCredentialsControl = defineAsyncComponent(
  () => import("../uiComponents/credentials/LegacyCredentialsControl.vue"),
);

export const legacyCredentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.legacyCredentials;
};

export const legacyCredentialsRenderer = {
  name: "LegacyCredentialsControl",
  renderer: LegacyCredentialsControl,
  tester: rankWith(priorityRanks.default, legacyCredentialsTester),
};
