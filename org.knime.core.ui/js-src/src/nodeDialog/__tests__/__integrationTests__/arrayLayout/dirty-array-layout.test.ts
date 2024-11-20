import { beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import PlusIcon from "@knime/styles/img/icons/plus.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";
import { DialogService, JsonDataService } from "@knime/ui-extension-service";

import {
  controllingFlowVariableState,
  exposedFlowVariableState,
} from "@@/test-setup/utils/integration/dirtySettingState";
import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import { getOptions } from "@/nodeDialog/__tests__/utils";

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

  const clickAddButton = (wrapper: Wrapper) => {
    const plusButton: HTMLButtonElement = wrapper
      .find(".array")
      .findComponent(PlusIcon).element.parentElement! as HTMLButtonElement;
    return plusButton.click();
  };

  const clickLastTrashButton = (wrapper: Wrapper) => {
    const lastTrashButton: HTMLButtonElement = wrapper
      .find(".array")
      .findAllComponents(TrashIcon)
      .at(-1).element.parentElement! as HTMLButtonElement;
    return lastTrashButton.click();
  };

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
                  scope: "#/properties/value",
                  type: "Control",
                },
              ],
            },
          },
        ],
      },
      flowVariableSettings: {},
    });
  };

  let dirtyStates: { getValue: () => unknown; initialValue: unknown }[];

  const registerSetting = ({ initialValue }: { initialValue: unknown }) => {
    let value = initialValue;
    const setValue = (v: unknown) => {
      value = v;
    };
    const dirtyState = {
      getValue: () => value,
      initialValue,
    };
    dirtyStates.push(dirtyState);
    return {
      addControllingFlowVariable: () => controllingFlowVariableState,
      addExposedFlowVariable: () => exposedFlowVariableState,
      setValue,
    };
  };

  beforeEach(async () => {
    dirtyStates = [];
    vi.spyOn(DialogService.prototype, "registerSettings").mockImplementation(
      () => registerSetting,
    );
    mockInitialData();
    wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
    await vi.dynamicImportSettled();
  });

  const getCurrentValues = () => dirtyStates.map(({ getValue }) => getValue());
  const isClean = () =>
    dirtyStates
      .map(({ getValue, initialValue }) => getValue() === initialValue)
      .filter((clean) => clean === false).length === 0;

  const initialCleanState = [3, "1", "2", "3"];

  it("sets initial states", () => {
    expect(getCurrentValues()).toStrictEqual(initialCleanState);
    expect(isClean()).toBeTruthy();
  });

  it("becomes dirty when adding an element", async () => {
    await clickAddButton(wrapper);
    expect(getCurrentValues()).toStrictEqual([4, "1", "2", "3", "new"]);
    expect(isClean()).toBeFalsy();
  });

  it("becomes dirty when removing an element", async () => {
    await clickLastTrashButton(wrapper);
    expect(getCurrentValues()).toStrictEqual([2, "1", "2", undefined]);
    expect(isClean()).toBeFalsy();
  });

  it("becomes clean when removing an added element", async () => {
    await clickAddButton(wrapper);
    await clickLastTrashButton(wrapper);
    expect(getCurrentValues()).toStrictEqual([...initialCleanState, undefined]);
    expect(isClean()).toBeTruthy();
  });
});
