import { rankWith } from "@jsonforms/core";
import { priorityRanks, inputFormats } from "../constants";
import CredentialsControl from "../uiComponents/credentials/CredentialsControl.vue";

export const credentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.credentials;
};

export const credentialsRenderer = {
  renderer: CredentialsControl,
  tester: rankWith(priorityRanks.default, credentialsTester),
};
