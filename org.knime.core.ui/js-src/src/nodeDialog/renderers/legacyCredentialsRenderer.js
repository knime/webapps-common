import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import LegacyCredentialsControl from "../uiComponents/credentials/LegacyCredentialsControl.vue";

export const legacyCredentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.legacyCredentials;
};

export const legacyCredentialsRenderer = {
  renderer: LegacyCredentialsControl,
  tester: rankWith(priorityRanks.default, legacyCredentialsTester),
};
