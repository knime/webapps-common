import { describe, it, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { DialogService, JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "@/nodeDialog/__tests__/utils";
import SimpleButtonInput from "@/nodeDialog/uiComponents/SimpleButtonInput.vue";
import Button from "webapps-common/ui/components/Button.vue";

describe("dirty array layout", () => {
  type Wrapper = VueWrapper<any> & {
    vm: {
      schema: {
        flowVariablesMap: Record<string, any>;
        getData(): any;
      };
    };
  };

  let wrapper: Wrapper;

  const mockInitialData = () => {
    vi.clearAllMocks();
    const uiSchemaKey = "ui_schema";
    vi.spyOn(JsonDataService.prototype, "initialData").mockResolvedValue({
      data: { model: { values: ["1", "2", "3"].map((value) => ({ value })) } },
      schema: {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              values: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    value: {
                      type: "string",
                      default: "new",
                    },
                  },
                },
              },
            },
          },
        },
      },
      [uiSchemaKey]: {
        elements: [
          {
            scope: "#/properties/model/properties/values",
            type: "Control",
            options: {
              detail: [
                {
                  type: "Control",
                  options: {
                    format: "simpleButton",
                    triggerId: "simpleButtonTriggerId",
                  },
                },
                {
                  scope: "#/properties/value",
                  type: "Control",
                },
              ],
            },
          },
        ],
        globalUpdates: [
          {
            trigger: {
              id: "simpleButtonTriggerId",
            },
            dependencies: [],
          },
        ],
      },
      flowVariableSettings: {},
    });
  };

  const triggerNthButton = (wrapper: Wrapper, n: number) =>
    wrapper
      .find(".array")
      .findAllComponents(SimpleButtonInput as any)
      .at(n)
      .findComponent(Button)
      .trigger("click");

  beforeEach(async () => {
    mockInitialData();
    vi.spyOn(DialogService.prototype, "registerSettings").mockImplementation(
      () => () => ({
        setValue: () => ({}),
        addControllingFlowVariable: () => ({
          set: () => {},
          unset: () => {},
        }),
        addExposedFlowVariable: () => ({
          set: () => {},
          unset: () => {},
        }),
      }),
    );
    vi.spyOn(JsonDataService.prototype, "data").mockResolvedValue({});
    wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
  });

  it("sets initial states", () => {
    triggerNthButton(wrapper, 0);
  });
});
