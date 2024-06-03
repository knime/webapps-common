import { describe, it, vi, beforeEach, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "@/nodeDialog/__tests__/utils";
import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";
import {
  Update,
  UpdateResult,
  ValueReference,
} from "@/nodeDialog/types/Update";

describe("updates in array layouts", () => {
  type Wrapper = VueWrapper<any> & {
    vm: {
      schema: {
        flowVariablesMap: Record<string, any>;
        getData(): any;
      };
    };
  };

  beforeEach(() => {
    mockRegisterSettings();
  });

  const uiSchemaKey = "ui_schema";

  const triggers = {
    Initially: "Initially",
    A: "A",
    B: "B",
  } as const;
  const updates = {
    Initially: "a",
    A: "b",
    B: "c",
  };

  const elementSchema = {
    type: "object",
    properties: {
      a: {
        type: "string",
      },
      b: {
        type: "string",
      },
      c: {
        type: "string",
      },
    },
  };

  const elementUiSchema = [
    {
      scope: "#/properties/model/properties/a",
      type: "Control",
    },
    {
      scope: "#/properties/model/properties/b",
      type: "Control",
    },
    {
      scope: "#/properties/model/properties/c",
      type: "Control",
    },
  ];

  const getGlobalUpdates = (
    getScopes: (fieldKey: string) => string[],
  ): Update[] => [
    {
      trigger: {
        scopes: undefined,
        id: triggers.Initially,
        triggerInitially: true,
      },
      dependencies: [] as ValueReference[],
    },
    {
      trigger: {
        scopes: getScopes("a"),
        id: triggers.A,
        triggerInitially: undefined,
      },
      dependencies: [] as ValueReference[],
    },
    {
      trigger: {
        scopes: getScopes("b"),
        id: triggers.B,
        triggerInitially: undefined,
      },
      dependencies: [] as ValueReference[],
    },
  ];

  const mockInitialData = (initialDataJson: object) =>
    vi
      .spyOn(JsonDataService.prototype, "initialData")
      .mockResolvedValue(initialDataJson);

  const mockRpcCall = (getScopes: (fieldKey: string) => string[]) =>
    vi
      .spyOn(JsonDataService.prototype, "data")
      .mockImplementation(({ options } = { options: [] }) =>
        Promise.resolve({
          state: "SUCCESS",
          result: [
            {
              scopes: getScopes(updates[options[1] as keyof typeof triggers]),
              value: "Updated",
              id: null,
            },
          ] satisfies UpdateResult[],
        }),
      );

  const mountNodeDialog = async ({
    initialDataJson,
    getScopes,
  }: {
    initialDataJson: object;
    getScopes: (fieldKey: string) => string[];
  }) => {
    vi.clearAllMocks();
    mockInitialData(initialDataJson);
    mockRpcCall(getScopes);
    const wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
    return wrapper;
  };

  it("triggers transitive updates", async () => {
    const getScopes = (fieldKey: string) => [
      `#/properties/view/properties/${fieldKey}`,
    ];
    const wrapper = await mountNodeDialog({
      initialDataJson: {
        data: {
          view: {
            c: "InitialValue",
          },
        },
        schema: {
          type: "object",
          properties: {
            view: elementSchema,
          },
        },
        [uiSchemaKey]: {
          elements: elementUiSchema,
          globalUpdates: getGlobalUpdates(getScopes),
          initialUpdates: [] as UpdateResult[],
        },
        flowVariableSettings: {},
      },
      getScopes,
    });

    expect(wrapper.vm.getData().data.view).toStrictEqual({
      a: "Updated",
      b: "Updated",
      c: "Updated",
    });
  });

  it("triggers transitive updates within array layouts", async () => {
    const getScopes = (fieldKey: string) => [
      "#/properties/values",
      `#/properties/${fieldKey}`,
    ];
    const wrapper = await mountNodeDialog({
      initialDataJson: {
        data: {
          values: [
            {
              c: "InitialValue",
            },
          ],
        },
        schema: {
          type: "object",
          properties: {
            values: {
              type: "array",
              items: elementSchema,
            },
          },
        },
        [uiSchemaKey]: {
          elements: [
            {
              scope: "#/properties/values",
              type: "Control",
              options: {
                arrayElementTitle: "Element",
                detail: elementUiSchema,
              },
            },
          ],
          globalUpdates: getGlobalUpdates(getScopes),
          initialUpdates: [] as UpdateResult[],
        },
        flowVariableSettings: {},
      },
      getScopes,
    });

    expect(wrapper.vm.getData().data.values[0]).toMatchObject({
      a: "Updated",
      b: "Updated",
      c: "Updated",
    });
  });
});
