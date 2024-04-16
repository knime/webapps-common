import { describe, it, vi, beforeEach, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import flushPromises from "flush-promises";
import { cloneDeep } from "lodash-es";

import { getOptions } from "@/nodeDialog/__tests__/utils";
import SimpleButtonInput from "@/nodeDialog/uiComponents/SimpleButtonInput.vue";
import Button from "webapps-common/ui/components/Button.vue";
import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import { Update, UpdateResult } from "@/nodeDialog/types/Update";

describe("dirty array layout", () => {
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

  const baseInitialDataJson = {
    data: {
      model: {
        values: Array.from({ length: 3 }).map((_v, i) => ({ value: `${i}` })),
      },
    },
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
            arrayElementTitle: "Element",
            detail: [
              {
                scope: "#/properties/value",
                type: "Control",
              } as any,
            ],
          },
        },
      ],
      globalUpdates: [] as Update[],
      initialUpdates: [] as UpdateResult[],
    },
    flowVariableSettings: {},
  };

  let initialDataJson: typeof baseInitialDataJson;

  beforeEach(() => {
    initialDataJson = cloneDeep(baseInitialDataJson);
  });

  const mockInitialData = () => {
    vi.clearAllMocks();
    vi.spyOn(JsonDataService.prototype, "initialData").mockResolvedValue(
      initialDataJson,
    );
  };

  const mockRPCResult = (result: UpdateResult[]) => {
    vi.spyOn(JsonDataService.prototype, "data").mockResolvedValue({
      state: "SUCCESS",
      result,
    });
  };

  const makeTextDropdownWithChoicesProvider = (choicesProviderId: string) => {
    initialDataJson[uiSchemaKey].elements[0].options.detail[0].options = {
      format: "dropDown",
      choicesProvider: choicesProviderId,
    };
  };

  const addButtonToElements = (buttonId: string) => {
    initialDataJson[uiSchemaKey].elements[0].options.detail.push({
      type: "Control",
      options: {
        format: "simpleButton",
        triggerId: buttonId,
      },
    });
    initialDataJson[uiSchemaKey].globalUpdates = [
      {
        trigger: {
          id: buttonId,
          scope: "",
          triggerInitially: undefined,
        },
        dependencies: [],
      },
    ];
  };

  const possibleValues = [
    { id: "foo", text: "Foo" },
    { id: "bar", text: "Bar" },
  ];

  const triggerNthButton = (wrapper: Wrapper, n: number) =>
    wrapper
      .find(".array")
      .findAllComponents(SimpleButtonInput as any)
      .at(n)
      .findComponent(Button)
      .trigger("click");

  const getNthDropdown = (wrapper: Wrapper, n: number) =>
    wrapper
      .find(".array")
      .findAllComponents(Dropdown as any)
      .at(n);

  it.each([
    [0, [1, 2]],
    [1, [0, 2]],
    [2, [0, 1]],
  ])(
    "triggers ui state updates from trigger within array element %s",
    async (index, otherIndices) => {
      const myChoicesProvider = "myChoicesProvider";
      vi.spyOn(JsonDataService.prototype, "data").mockResolvedValue({
        state: "SUCCESS",
        result: [
          {
            id: myChoicesProvider,
            value: possibleValues,
          },
        ],
      });
      mockRPCResult([
        {
          id: myChoicesProvider,
          value: possibleValues,
          path: null,
        },
      ]);
      makeTextDropdownWithChoicesProvider(myChoicesProvider);
      addButtonToElements("myButtonRefId");
      mockInitialData();
      const wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
      await flushPromises();

      triggerNthButton(wrapper, index);
      await flushPromises();

      expect(
        getNthDropdown(wrapper, index).props().possibleValues,
      ).toStrictEqual(possibleValues);
      otherIndices.forEach((otherIndex) =>
        expect(
          getNthDropdown(wrapper, otherIndex).props().possibleValues,
        ).toStrictEqual([]),
      );
    },
  );
});
