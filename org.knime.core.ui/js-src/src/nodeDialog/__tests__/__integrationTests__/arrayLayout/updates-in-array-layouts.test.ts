/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-lines */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { VueWrapper, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { cloneDeep } from "lodash-es";

import { Button, Checkbox, Dropdown } from "@knime/components";
import { JsonDataService } from "@knime/ui-extension-service";

import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";
import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import { getOptions } from "@/nodeDialog/__tests__/utils";
import type {
  Update,
  UpdateResult,
  ValueReference,
} from "@/nodeDialog/types/Update";
import SimpleButtonControl from "@/nodeDialog/uiComponents/SimpleButtonControl.vue";
import TextControl from "@/nodeDialog/uiComponents/TextControl.vue";

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

  const getInitialText = (index: number) => `Initial text ${index}`;

  const arrayIndices = Array.from({ length: 3 }, (_v, i) => i);

  const getListOfItemAndOtherItemsPairs = (numbers: number[]) =>
    numbers.map((i) => [i, numbers.filter((j) => j !== i)] as const);

  const arrayIndexWithOtherIndicesList =
    getListOfItemAndOtherItemsPairs(arrayIndices);

  const baseInitialDataJson = {
    data: {
      model: {
        values: arrayIndices.map((i) => ({
          value: getInitialText(i),
        })),
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
              },
            ],
          },
        } as any,
      ],
    },
    globalUpdates: [] as Update[],
    initialUpdates: [] as UpdateResult[],
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

  const mountNodeDialog = async () => {
    mockInitialData();
    const wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
    await vi.dynamicImportSettled();
    return wrapper;
  };

  const mockRPCResult = (getResult: () => UpdateResult[]) =>
    vi.spyOn(JsonDataService.prototype, "data").mockImplementation(() =>
      Promise.resolve({
        state: "SUCCESS",
        result: getResult(),
      }),
    );

  // Buttons

  const registerButtonTriggerInGlobalUpdates = (buttonId: string) => {
    const dependencies: ValueReference[] = [];
    initialDataJson.globalUpdates = [
      {
        trigger: {
          id: buttonId,
          scopes: undefined,
          triggerInitially: undefined,
        },
        dependencies,
      },
    ];

    return {
      addDependency: (valueReference: ValueReference) =>
        dependencies.push(valueReference),
    };
  };

  const getSimpleButtonUiSchema = (buttonId: string) => ({
    type: "Control",
    options: {
      format: "simpleButton",
      triggerId: buttonId,
    },
  });

  const addSimpleButtonControlToElements = (buttonId: string) => {
    initialDataJson[uiSchemaKey].elements[0].options.detail.push(
      getSimpleButtonUiSchema(buttonId),
    );
  };

  const addSimpleButtonControlAfterArray = (buttonId: string) => {
    initialDataJson[uiSchemaKey].elements.push(
      getSimpleButtonUiSchema(buttonId),
    );
  };

  const addButtonToElements = () => {
    const buttonId = "myButtonRefId";
    addSimpleButtonControlToElements(buttonId);
    const { addDependency } = registerButtonTriggerInGlobalUpdates(buttonId);
    return {
      addDependency,
      triggerNthButton: async (wrapper: Wrapper, n: number) => {
        wrapper
          .find(".array")
          .findAllComponents(SimpleButtonControl as any)
          .at(n)
          .findComponent(Button)
          .trigger("click");
        await flushPromises();
      },
    };
  };

  const addButtonAfterArray = () => {
    const buttonId = "myButtonRefId";
    addSimpleButtonControlAfterArray(buttonId);
    const { addDependency } = registerButtonTriggerInGlobalUpdates(buttonId);
    return {
      addDependency,
      triggerButton: async (wrapper: Wrapper) => {
        wrapper
          .findComponent(SimpleButtonControl as any)
          .findComponent(Button)
          .trigger("click");
        await flushPromises();
      },
    };
  };

  // Checkbox

  const addCheckboxToElements = () => {
    initialDataJson[uiSchemaKey].elements[0].options.detail.push({
      scope: "#/properties/checkboxValue",
      type: "Control",
      options: {
        format: "checkbox",
      },
    });
    // @ts-expect-error since checkboxValue is new
    initialDataJson.schema.properties.model.properties.values.items.properties.checkboxValue =
      {
        type: "boolean",
      };
    initialDataJson.globalUpdates = [
      {
        trigger: {
          id: "checkboxFieldId",
          scopes: [
            "#/properties/model/properties/values",
            "#/properties/checkboxValue",
          ],
          triggerInitially: undefined,
        },
        dependencies: [],
      },
    ];

    return {
      toggleNthCheckbox: async (wrapper: Wrapper, n: number) => {
        wrapper
          .find(".array")
          .findAllComponents(Checkbox)
          .at(n)
          .find("input")
          .trigger("change");
        await flushPromises();
      },
    };
  };

  // Dropdown

  const makeTextDropdownWithChoicesProvider = (choicesProviderId: string) => {
    initialDataJson[uiSchemaKey].elements[0].options.detail[0].options = {
      format: "dropDown",
      choicesProvider: choicesProviderId,
    };
  };

  const mockRPCResultToUpdateElementDropdownChoices = (
    choicesProviderId: string,
  ) => {
    const possibleValues = ref([
      { id: "foo", text: "Foo" },
      { id: "bar", text: "Bar" },
    ]);
    mockRPCResult(() => [
      {
        id: choicesProviderId,
        values: [{ indices: [], value: possibleValues.value }],
        scopes: null,
      },
    ]);
    return {
      getNthDropdownChoices: (wrapper: Wrapper, n: number) =>
        wrapper
          .find(".array")
          .findAllComponents(Dropdown as any)
          .at(n)
          .props().possibleValues,
      possibleValues,
    };
  };

  // Text value update

  const mockRPCResultToUpdateElementTextValue = () => {
    const newValue = "new value";
    mockRPCResult(() => [
      {
        id: null,
        values: [{ indices: [], value: newValue }],
        scopes: ["#/properties/model/properties/values", "#/properties/value"],
      },
    ]);
    return {
      getNthTextValue: (wrapper: Wrapper, n: number) =>
        wrapper
          .find(".array")
          .findAllComponents(TextControl as any)
          .at(n)
          .find("input").element.value,
      newValue,
    };
  };

  const createDropdownWithToBeUpdatedChoices = () => {
    const myChoicesProvider = "myChoicesProvider";
    makeTextDropdownWithChoicesProvider(myChoicesProvider);

    return mockRPCResultToUpdateElementDropdownChoices(myChoicesProvider);
  };

  describe("ui triggers and ui states", () => {
    const prepareDropdownUpdatedByButton = async () => {
      const { triggerNthButton } = addButtonToElements();
      const { getNthDropdownChoices, possibleValues } =
        createDropdownWithToBeUpdatedChoices();

      const wrapper = await mountNodeDialog();
      return {
        wrapper,
        possibleValues,
        triggerNthButton,
        getNthDropdownChoices,
      };
    };

    it.each(arrayIndexWithOtherIndicesList)(
      "performs ui state updates from trigger within array element %s",
      async (index, otherIndices) => {
        const {
          wrapper,
          possibleValues,
          getNthDropdownChoices,
          triggerNthButton,
        } = await prepareDropdownUpdatedByButton();

        await triggerNthButton(wrapper, index);

        expect(getNthDropdownChoices(wrapper, index)).toStrictEqual(
          possibleValues.value,
        );
        otherIndices.forEach((otherIndex) =>
          expect(getNthDropdownChoices(wrapper, otherIndex)).toStrictEqual([]),
        );
      },
    );

    const prepareDropdownUpdatedByOutsideButton = async () => {
      const { triggerButton } = addButtonAfterArray();
      const { getNthDropdownChoices, possibleValues } =
        createDropdownWithToBeUpdatedChoices();

      const wrapper = await mountNodeDialog();
      return { wrapper, possibleValues, triggerButton, getNthDropdownChoices };
    };

    it("performs ui state update within all array elements from trigger outside of the array", async () => {
      const { wrapper, possibleValues, triggerButton, getNthDropdownChoices } =
        await prepareDropdownUpdatedByOutsideButton();

      await triggerButton(wrapper);

      arrayIndices.forEach((i) =>
        expect(getNthDropdownChoices(wrapper, i)).toStrictEqual(
          possibleValues.value,
        ),
      );
    });
  });

  describe("value updates and dependencies", () => {
    const prepareTextUpdatedByButton = async () => {
      const { triggerNthButton } = addButtonToElements();
      const { getNthTextValue, newValue } =
        mockRPCResultToUpdateElementTextValue();

      const wrapper = await mountNodeDialog();
      return { wrapper, newValue, triggerNthButton, getNthTextValue };
    };

    it.each(arrayIndexWithOtherIndicesList)(
      "performs value updates from trigger within array element %s",
      async (index, otherIndices) => {
        const { wrapper, newValue, triggerNthButton, getNthTextValue } =
          await prepareTextUpdatedByButton();

        await triggerNthButton(wrapper, index);

        expect(getNthTextValue(wrapper, index)).toStrictEqual(newValue);
        otherIndices.forEach((otherIndex) =>
          expect(getNthTextValue(wrapper, otherIndex)).toStrictEqual(
            getInitialText(otherIndex),
          ),
        );
      },
    );

    const prepareTextUpdatedByOutsideButton = async () => {
      const { triggerButton } = addButtonAfterArray();
      const { getNthTextValue, newValue } =
        mockRPCResultToUpdateElementTextValue();

      const wrapper = await mountNodeDialog();
      return { wrapper, newValue, triggerButton, getNthTextValue };
    };

    it("performs value update within all array element from trigger outside of the array", async () => {
      const { wrapper, newValue, triggerButton, getNthTextValue } =
        await prepareTextUpdatedByOutsideButton();

      await triggerButton(wrapper);

      arrayIndices.forEach((i) =>
        expect(getNthTextValue(wrapper, i)).toStrictEqual(newValue),
      );
    });

    const prepareDropdownUpdatedByCheckboxToggle = async () => {
      const { toggleNthCheckbox } = addCheckboxToElements();
      const { getNthDropdownChoices, possibleValues } =
        createDropdownWithToBeUpdatedChoices();

      const wrapper = await mountNodeDialog();
      return {
        wrapper,
        possibleValues,
        toggleNthCheckbox,
        getNthDropdownChoices,
      };
    };

    it("triggers value updates within arrays initially", async () => {
      const { getNthDropdownChoices, possibleValues, wrapper } =
        await prepareDropdownUpdatedByCheckboxToggle();
      arrayIndices.forEach((index) =>
        expect(getNthDropdownChoices(wrapper, index)).toStrictEqual(
          possibleValues.value,
        ),
      );
    });

    it.each(arrayIndexWithOtherIndicesList)(
      "triggers update from value change within array element %s",
      async (index, otherIndices) => {
        const {
          getNthDropdownChoices,
          possibleValues,
          toggleNthCheckbox,
          wrapper,
        } = await prepareDropdownUpdatedByCheckboxToggle();

        const initialPossibleValues = possibleValues.value;
        const updatedPossibleValues = [
          {
            id: "James",
            text: "Bond",
          },
        ];
        possibleValues.value = updatedPossibleValues;

        await toggleNthCheckbox(wrapper, index);

        expect(getNthDropdownChoices(wrapper, index)).toStrictEqual(
          updatedPossibleValues,
        );
        otherIndices.forEach((otherIndex) =>
          expect(getNthDropdownChoices(wrapper, otherIndex)).toStrictEqual(
            initialPossibleValues,
          ),
        );
      },
    );
  });

  describe("dependencies within array elements", () => {
    const createTextDependency = (dependencyId: string) => ({
      id: dependencyId,
      scopes: ["#/properties/model/properties/values", "#/properties/value"],
    });

    const prepareUpdateByButtonWithDependency = async () => {
      const { triggerNthButton, addDependency } = addButtonToElements();
      const dependencyId = "myDependencyId";
      addDependency(createTextDependency(dependencyId));
      const rpcDataSpy = mockRPCResult(() => []);

      const wrapper = await mountNodeDialog();
      return { wrapper, rpcDataSpy, dependencyId, triggerNthButton };
    };

    it.each(arrayIndices)(
      "provides dependencies from within array element %s",
      async (index) => {
        const { wrapper, rpcDataSpy, dependencyId, triggerNthButton } =
          await prepareUpdateByButtonWithDependency();

        await triggerNthButton(wrapper, index);

        expect(rpcDataSpy).toHaveBeenCalledWith({
          method: "settings.update2",
          options: [
            null,
            expect.anything(),
            {
              [dependencyId]: [{ indices: [], value: getInitialText(index) }],
            },
          ],
        });
      },
    );

    describe("updates from outside the array layout with dependencies within", () => {
      const prepareUpdateByButtonOutsideWithDependencyWithin = async () => {
        const { triggerButton, addDependency } = addButtonAfterArray();
        const dependencyId = "myDependencyId";
        addDependency(createTextDependency(dependencyId));
        const rpcDataSpy = mockRPCResult(() => []);

        const wrapper = await mountNodeDialog();
        return { wrapper, rpcDataSpy, dependencyId, triggerButton };
      };

      it("allows updates triggered outside array with dependencies from within array", async () => {
        const { wrapper, rpcDataSpy, dependencyId, triggerButton } =
          await prepareUpdateByButtonOutsideWithDependencyWithin();

        await triggerButton(wrapper);

        expect(rpcDataSpy).toHaveBeenCalledWith({
          method: "settings.update2",
          options: [
            null,
            expect.anything(),
            {
              [dependencyId]: expect.anything(),
            },
          ],
        });
      });

      const wrapArrayInHiddenSection = () => {
        initialDataJson[uiSchemaKey].elements[0] = {
          type: "Section",
          elements: initialDataJson[uiSchemaKey].elements[0],
          rule: {
            effect: "HIDE",
            condition: {
              scope: "#/properties/model/properties/hideValues",
              schema: {
                const: true,
              },
            },
          },
        };
      };

      const prepareUpdateByButtonOutsideWithDependencyWithinHiddenArray =
        async () => {
          const { triggerButton, addDependency } = addButtonAfterArray();
          const dependencyId = "myDependencyId";
          addDependency(createTextDependency(dependencyId));
          const rpcDataSpy = mockRPCResult(() => []);
          wrapArrayInHiddenSection();

          const wrapper = await mountNodeDialog();
          return {
            wrapper,
            rpcDataSpy,
            dependencyId,
            triggerButton,
          };
        };

      it("allows initial ui state updates triggered outside array with different updates within hidden array", async () => {
        const { wrapper, rpcDataSpy, dependencyId, triggerButton } =
          await prepareUpdateByButtonOutsideWithDependencyWithinHiddenArray();
        await triggerButton(wrapper);

        expect(rpcDataSpy).toHaveBeenCalledWith({
          method: "settings.update2",
          options: [
            null,
            expect.anything(),
            {
              [dependencyId]: expect.anything(),
            },
          ],
        });
      });

      describe.each([
        [
          "computeBeforeOpenDialog",
          (updateResult: UpdateResult) => {
            initialDataJson.initialUpdates = [updateResult];
            return { expectAfterMount: () => {} };
          },
        ],
        [
          "computeAfterOpenDialog",
          (updateResult: UpdateResult) => {
            initialDataJson.globalUpdates = [
              {
                trigger: {
                  id: "afterOpenDialog",
                  scopes: undefined,
                  triggerInitially: true,
                },
                dependencies: [
                  {
                    id: "dependencyId",
                    scopes: [
                      "#/properties/model/properties/values",
                      "#/properties/value",
                    ],
                  },
                ],
              },
            ];
            const rpcDataSpy = mockRPCResult(() => [updateResult]);
            return {
              expectAfterMount: () =>
                expect(rpcDataSpy).toHaveBeenCalledWith({
                  method: "settings.update2",
                  options: [
                    null,
                    expect.anything(),
                    {
                      dependencyId: arrayIndices.map((i) =>
                        expect.objectContaining({
                          indices: [expect.any(String)],
                          value: getInitialText(i),
                        }),
                      ),
                    },
                  ],
                }),
            };
          },
        ],
      ])("initialUpdates (%s)", (type, mockInitialUpdate) => {
        const getInitialUpdateValues = <T>(initialUpdateValues: T[]) =>
          arrayIndices.map((i) => ({
            indices: [i],
            value: initialUpdateValues[i],
          }));

        const defineInitialValueUpdates = () => {
          const initialUpdateValues = arrayIndices.map(
            (i) => `Initially updated value ${i}`,
          );
          const { expectAfterMount } = mockInitialUpdate({
            id: null,
            values: getInitialUpdateValues(initialUpdateValues),
            scopes: [
              "#/properties/model/properties/values",
              "#/properties/value",
            ],
          });

          return {
            getNthTextValue: (wrapper: Wrapper, n: number) =>
              wrapper
                .find(".array")
                .findAllComponents(TextControl as any)
                .at(n)
                .find("input").element.value,
            initialUpdateValues,
            expectAfterMount,
          };
        };

        const prepareInitialValueUpdatesForEachArrayElement = async () => {
          const { initialUpdateValues, getNthTextValue, expectAfterMount } =
            defineInitialValueUpdates();
          const wrapper = await mountNodeDialog();
          expectAfterMount();
          return {
            wrapper,
            initialUpdateValues,
            getNthTextValue,
            expectAfterMount,
          };
        };

        it("allows initial value updates triggered outside array with different updates within array", async () => {
          const { wrapper, initialUpdateValues, getNthTextValue } =
            await prepareInitialValueUpdatesForEachArrayElement();

          arrayIndices.forEach((index) =>
            expect(getNthTextValue(wrapper, index)).toBe(
              initialUpdateValues[index],
            ),
          );
        });

        const defineInitialDropdownUpdates = () => {
          const choicesProviderId = "myChoicesProvider";
          makeTextDropdownWithChoicesProvider(choicesProviderId);
          const initialUpdateChoices = arrayIndices.map((i) => [
            { id: `initialChoice${i}`, text: `Initial choice ${i}` },
          ]);
          const { expectAfterMount } = mockInitialUpdate({
            id: choicesProviderId,
            values: initialUpdateChoices.map((choices, i) => ({
              indices: [i],
              value: choices,
            })),
            scopes: null,
          });

          return {
            getNthDropdownChoices: (wrapper: Wrapper, n: number) =>
              wrapper
                .find(".array")
                .findAllComponents(Dropdown as any)
                .at(n)
                .props().possibleValues,
            initialUpdateChoices,
            expectAfterMount,
          };
        };

        const prepareInitialDropdownChoicesUpdatesForEachArrayElement =
          async () => {
            const {
              getNthDropdownChoices,
              initialUpdateChoices,
              expectAfterMount,
            } = defineInitialDropdownUpdates();
            const wrapper = await mountNodeDialog();
            expectAfterMount();
            return {
              wrapper,
              initialUpdateChoices,
              getNthDropdownChoices,
            };
          };

        it("allows initial ui state updates triggered outside array with different updates within array", async () => {
          const { wrapper, initialUpdateChoices, getNthDropdownChoices } =
            await prepareInitialDropdownChoicesUpdatesForEachArrayElement();

          arrayIndices.forEach((index) =>
            expect(getNthDropdownChoices(wrapper, index)).toStrictEqual(
              initialUpdateChoices[index],
            ),
          );
        });
      });
    });
  });
});
