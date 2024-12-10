import { defineAsyncComponent } from "vue";
import { rankWith } from "@jsonforms/core";

import { inputFormats, priorityRanks } from "../constants";

const CredentialsControl = defineAsyncComponent(() =>
  import("../uiComponents/credentials/CredentialsControl.vue"),
);

export const credentialsTester = (uischema, _schema) => {
  return uischema.options?.format === inputFormats.credentials;
};

export const credentialsRenderer = {
  name: "CredentialsControl",
  renderer: CredentialsControl,
  tester: rankWith(priorityRanks.default, credentialsTester),
};
