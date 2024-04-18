import { describe, it, vi, beforeEach, expect } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { AlertingService, JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import flushPromises from "flush-promises";
import { cloneDeep } from "lodash-es";

import { getOptions } from "@/nodeDialog/__tests__/utils";
import SimpleButtonInput from "@/nodeDialog/uiComponents/SimpleButtonInput.vue";
import Button from "webapps-common/ui/components/Button.vue";
import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import {
  Update,
  UpdateResult,
  ValueReference,
} from "@/nodeDialog/types/Update";
import TextInput from "@/nodeDialog/uiComponents/TextInput.vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";

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

  const getInitialText = (index: number) => `${index}`;

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

  const mountNodeDialog = async () => {
    mockInitialData();
    const wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
    return wrapper;
  };

  const mockRPCResult = (result: UpdateResult[]) =>
    vi.spyOn(JsonDataService.prototype, "data").mockResolvedValue({
      state: "SUCCESS",
      result,
    });

  // Buttons

  const registerButtonTriggerInGlobalUpdates = (buttonId: string) => {
    const dependencies: ValueReference[] = [];
    initialDataJson[uiSchemaKey].globalUpdates = [
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

  const addSimpleButtonInputToElements = (buttonId: string) => {
    initialDataJson[uiSchemaKey].elements[0].options.detail.push(
      getSimpleButtonUiSchema(buttonId),
    );
  };

  const addSimpleButtonInputAfterArray = (buttonId: string) => {
    initialDataJson[uiSchemaKey].elements.push(
      getSimpleButtonUiSchema(buttonId),
    );
  };

  const addButtonToElements = () => {
    const buttonId = "myButtonRefId";
    addSimpleButtonInputToElements(buttonId);
    const { addDependency } = registerButtonTriggerInGlobalUpdates(buttonId);
    return {
      addDependency,
      triggerNthButton: async (wrapper: Wrapper, n: number) => {
        wrapper
          .find(".array")
          .findAllComponents(SimpleButtonInput as any)
          .at(n)
          .findComponent(Button)
          .trigger("click");
        await flushPromises();
      },
    };
  };

  const addButtonAfterArray = () => {
    const buttonId = "myButtonRefId";
    addSimpleButtonInputAfterArray(buttonId);
    const { addDependency } = registerButtonTriggerInGlobalUpdates(buttonId);
    return {
      addDependency,
      triggerButton: async (wrapper: Wrapper) => {
        wrapper
          .findComponent(SimpleButtonInput as any)
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
    initialDataJson[uiSchemaKey].globalUpdates = [
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
    const possibleValues = [
      { id: "foo", text: "Foo" },
      { id: "bar", text: "Bar" },
    ];
    mockRPCResult([
      {
        id: choicesProviderId,
        value: possibleValues,
        path: null,
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
    mockRPCResult([
      {
        id: null,
        value: newValue,
        path: ["#/properties/model/properties/values", "#/properties/value"],
      },
    ]);
    return {
      getNthTextValue: (wrapper: Wrapper, n: number) =>
        wrapper
          .find(".array")
          .findAllComponents(TextInput as any)
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
          possibleValues,
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
        expect(getNthDropdownChoices(wrapper, i)).toStrictEqual(possibleValues),
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

    it.each(arrayIndexWithOtherIndicesList)(
      "triggers update from value change within array element %s",
      async (index, otherIndices) => {
        const {
          getNthDropdownChoices,
          possibleValues,
          toggleNthCheckbox,
          wrapper,
        } = await prepareDropdownUpdatedByCheckboxToggle();

        await toggleNthCheckbox(wrapper, index);

        expect(getNthDropdownChoices(wrapper, index)).toStrictEqual(
          possibleValues,
        );
        otherIndices.forEach((otherIndex) =>
          expect(getNthDropdownChoices(wrapper, otherIndex)).toStrictEqual([]),
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
      const rpcDataSpy = mockRPCResult([]);

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
              [dependencyId]: getInitialText(index),
            },
          ],
        });
      },
    );

    const prepareUpdateByButtonOutsideWithDependencyWithin = async () => {
      const { triggerButton, addDependency } = addButtonAfterArray();
      const dependencyId = "myDependencyId";
      addDependency(createTextDependency(dependencyId));
      const rpcDataSpy = mockRPCResult([]);

      const wrapper = await mountNodeDialog();
      return { wrapper, rpcDataSpy, dependencyId, triggerButton };
    };

    /**
     * TODO: UIEXT-1841 Reformulate this test to a happy path
     */
    it("logs error on update triggered outside array with dependencies from within array", async () => {
      const sendAlert = vi.spyOn(AlertingService.prototype, "sendAlert");
      const { wrapper, triggerButton } =
        await prepareUpdateByButtonOutsideWithDependencyWithin();
      // @ts-expect-error
      window.isTest = true;
      await triggerButton(wrapper);
      expect(sendAlert).toHaveBeenCalled();
    });
  });
});
