import { getOptions } from "@/nodeDialog/__tests__/utils";
import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import { JsonDataService } from "@knime/ui-extension-service";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { vi } from "vitest";

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
