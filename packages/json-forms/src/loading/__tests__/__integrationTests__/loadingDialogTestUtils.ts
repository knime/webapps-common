import { vi } from "vitest";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "./../../../NodeDialog.vue";
import { getOptions } from "./../../../__tests__/utils";

export const mockInitialData = (initialDataJson: object) =>
  vi
    .spyOn(JsonDataService.prototype, "initialData")
    .mockResolvedValue(initialDataJson);

let initialData: object;

export const mountNodeDialog = async () => {
  mockInitialData(initialData);
  const wrapper = mount(NodeDialog as any, getOptions());
  await flushPromises();
  return wrapper;
};

export const setInitialData = (data: object) => {
  initialData = data;
};

export const uiSchemaKey = "ui_schema";

export const dialogWithTextInputData = {
  data: {
    text: "Hello World",
  },
  schema: {
    type: "object",
    properties: {
      text: {
        type: "string",
      },
    },
  },
  [uiSchemaKey]: {
    elements: [
      {
        type: "Control",
        scope: "#/properties/text",
      },
    ],
    persist: {
      type: "object",
      properties: {
        text: {},
      },
    },
  },
  flowVariableSettings: {},
};
