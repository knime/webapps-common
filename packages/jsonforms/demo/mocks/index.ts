import type { JsonSchema, UISchemaElement } from "@jsonforms/core";

import googleAiStudio from "./aiModels/googleAiStudio.mock.json";
import adHocExecution from "./deployments/adHocExecution.mock.json";
import fileUpload from "./secrets/fileUpload.mock.json";
import genericOAuth2UsernamePassword from "./secrets/genericOAuth2UsernamePassword.mock.json";

export interface MockSchema {
  id: string;
  name: string;
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: unknown;
}

export const mocks: MockSchema[] = [
  {
    id: "adHocExecution",
    name: "Ad Hoc Execution",
    schema: adHocExecution.schema as JsonSchema,
    uischema: adHocExecution.uiSchema as UISchemaElement,
    data: adHocExecution.data,
  },
  {
    id: "genericOAuth2UsernamePassword",
    name: "Generic OAuth2 Username/Password",
    schema: genericOAuth2UsernamePassword.schema as JsonSchema,
    uischema: genericOAuth2UsernamePassword.uiSchema as UISchemaElement,
    data: genericOAuth2UsernamePassword.data,
  },
  {
    id: "googleAiStudio",
    name: "Google AI Studio",
    schema: googleAiStudio.schema as JsonSchema,
    uischema: googleAiStudio.uiSchema as UISchemaElement,
    data: googleAiStudio.data,
  },
  {
    id: "fileUpload",
    name: "File Upload",
    schema: fileUpload.schema as JsonSchema,
    uischema: fileUpload.uiSchema as UISchemaElement,
    data: fileUpload.data,
  },
];
