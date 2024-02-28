import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import LegacyCredentialsInput from "../uiComponents/credentials/LegacyCredentialsInput.vue";

export const legacyCredentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.legacyCredentials;
};

export const legacyCredentialsRenderer = {
  renderer: LegacyCredentialsInput,
  tester: rankWith(priorityRanks.default, legacyCredentialsTester),
};
