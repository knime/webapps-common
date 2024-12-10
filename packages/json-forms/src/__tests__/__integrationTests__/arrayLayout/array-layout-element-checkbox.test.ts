import { beforeEach, describe, expect, it, vi } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { cloneDeep } from "lodash-es";

import { Checkbox } from "@knime/components";
import { JsonDataService } from "@knime/ui-extension-service";

import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";

import NodeDialog from "./../../../NodeDialog.vue";
import { getOptions } from "./../../../__tests__/utils";

describe("edit/reset button in array layouts", () => {
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
        values: [{ controllingBoolean: true }, { controllingBoolean: false }],
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
                  controllingBoolean: {
                    type: "boolean",
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
            elementCheckboxScope: "#/properties/controllingBoolean",
            detail: [],
          },
        } as any,
      ],
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
    await vi.dynamicImportSettled();
    return wrapper;
  };

  const getNthElementCheckbox = (wrapper: Wrapper, n: number) =>
    wrapper
      .find(".array")
      .findAllComponents(Checkbox as any)
      .at(n);

  it("shows checkboxes within the array layout elements", async () => {
    const wrapper = await mountNodeDialog();

    expect(getNthElementCheckbox(wrapper, 0).props().modelValue).toBe(true);
    expect(getNthElementCheckbox(wrapper, 1).props().modelValue).toBe(false);
  });
});
