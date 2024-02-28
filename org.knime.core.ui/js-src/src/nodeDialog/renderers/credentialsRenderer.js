import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import CredentialsInput from "../uiComponents/credentials/CredentialsInput.vue";

export const credentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.credentials;
};

export const credentialsRenderer = {
  renderer: CredentialsInput,
  tester: rankWith(priorityRanks.default, credentialsTester),
};
