import { describe, expect, it, vi, beforeEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { JsonDataService } from "@knime/ui-extension-service";

import NodeDialog from "@/nodeDialog/NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "@/nodeDialog/__tests__/utils";
import TextInput from "@/nodeDialog/uiComponents/TextInput.vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";

describe("hide on null", () => {
  type Wrapper = VueWrapper<any> & {
    vm: {
      schema: {
        flowVariablesMap: Record<string, any>;
        getData(): any;
      };
    };
  };

  let wrapper: Wrapper;

  const findCheckbox = (wrapper: Wrapper) => {
    const textInput = wrapper.findComponent(TextInput);
    return textInput.findComponent(Checkbox);
  };

  beforeEach(() => {
    mockRegisterSettings()
  })

  const mountNodeDialog = async () => {
    wrapper = mount(NodeDialog as any, getOptions()) as Wrapper;
    await flushPromises();
  };

  const mockInitialData = (
    value: string | null = "",
    options: {
      hideOnNull?: true;
    } = {},
  ) => {
    vi.clearAllMocks();
    const uiSchemaKey = "ui_schema";
    vi.spyOn(JsonDataService.prototype, "initialData").mockResolvedValue({
      data: { model: { value } },
      schema: {
        type: "object",
        properties: {
          model: {
            type: "object",
            properties: {
              value: { type: "string" },
            },
          },
        },
      },
      [uiSchemaKey]: {
        elements: [
          {
            scope: "#/properties/model/properties/value",
            type: "Control",
            options,
          },
        ],
      },
      flowVariableSettings: {},
    });
  };

  it("does not show checkbox per default", async () => {
    mockInitialData();
    await mountNodeDialog();
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeFalsy();
  });

  it("shows checkbox which is checked on a null value", async () => {
    mockInitialData(null, {
      hideOnNull: true,
    });
    await mountNodeDialog();
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeTruthy();
    expect(checkbox.props().modelValue).toBe(false);
  });

  const mountNodeDialogAttachingToDocument = async () => {
    wrapper = mount(NodeDialog as any, {
      ...getOptions(),
      attachTo: document.body,
    }) as Wrapper;
    await flushPromises();
  };

  it("sets the value to a string value and sets focus to input element when checking the checkbox", async () => {
    mockInitialData(null, {
      hideOnNull: true,
    });
    await mountNodeDialogAttachingToDocument();
    const checkbox = findCheckbox(wrapper);
    await checkbox.vm.$emit("update:model-value", true);
    expect(wrapper.vm.getData().data.model.value).not.toBeNull();
    await flushPromises();
    expect(document.activeElement).toBe(
      wrapper.findComponent(InputField).find("input").element,
    );
  });

  it("shows checkbox which is checked on a non null value", async () => {
    mockInitialData("", {
      hideOnNull: true,
    });
    await mountNodeDialog();
    const checkbox = findCheckbox(wrapper);
    expect(checkbox.exists()).toBeTruthy();
    expect(checkbox.props().modelValue).toBe(true);
  });

  it("sets the value to null when unchecking the checkbox", async () => {
    mockInitialData("", {
      hideOnNull: true,
    });
    await mountNodeDialog();
    const checkbox = findCheckbox(wrapper);
    await checkbox.vm.$emit("update:model-value", false);
    expect(wrapper.vm.getData().data.model.value).toBeNull();
  });
});
