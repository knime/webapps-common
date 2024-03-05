import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledFileChooserInput from "../LabeledFileChooserInput.vue";
import LabeledInput from "../../label/LabeledInput.vue";
import DialogLabel from "../../label/DialogLabel.vue";
import StringFileChooserInputWithExplorer from "../StringFileChooserInputWithExplorer.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import NumberInput from "webapps-common/ui/components/forms/NumberInput.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import CustomUrlFileChooser from "../CustomUrlFileChooser.vue";
import flushPromises from "flush-promises";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";

describe("LabeledFileChooserInput.vue", () => {
  let props, wrapper, component;

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: {
          path: {
            path: "myPath",
            timeout: 1000,
            fsCategory: "LOCAL",
          },
        },
        schema: {
          type: "object",
          title: "File path",
          properties: {
            path: {
              type: "object",
              properties: {
                path: {
                  type: "string",
                },
                fsCategory: {
                  oneOf: [
                    {
                      const: "LOCAL",
                      title: "LOCAL",
                    },
                    {
                      const: "CUSTOM_URL",
                      title: "CUSTOM_URL",
                    },
                  ],
                },
                timeout: {
                  type: "integer",
                  format: "int32",
                },
              },
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/filePath",
          options: {
            format: "fileChooser",
          },
        },
      },
    };

    component = await mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(LabeledFileChooserInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(ValueSwitch).exists()).toBe(true);
    expect(
      wrapper.findComponent(StringFileChooserInputWithExplorer).exists(),
    ).toBe(true);
    expect(wrapper.findComponent(Checkbox).exists()).toBe(false);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(
      wrapper.getComponent(StringFileChooserInputWithExplorer).props().id,
    ).toBe(dialogLabel.vm.labelForId);
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls updateData when local file text input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(
      LabeledFileChooserInput,
      {
        props,
        provide: { setDirtyModelSettingsMock },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(StringFileChooserInputWithExplorer)
      .vm.$emit("update:modelValue", changedTextInput);
    const onChangePayload = {
      path: {
        fsCategory: "LOCAL",
        path: changedTextInput,
        timeout: 1000,
      },
    };
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      onChangePayload,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(ValueSwitch).vm.modelValue).toBe(
      props.control.data.path.fsCategory,
    );
    expect(
      wrapper.findComponent(StringFileChooserInputWithExplorer).vm.modelValue,
    ).toBe(props.control.data.path.path);
  });

  it("sets correct browsing options", async () => {
    props.control.uischema.options.fileExtension = "pdf";
    props.control.uischema.options.isWriter = true;

    const { wrapper } = await mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
    });
    expect(
      wrapper.findComponent(StringFileChooserInputWithExplorer).props().options,
    ).toMatchObject({
      fileExtension: "pdf",
      isWriter: true,
    });
  });

  it("renders with fsCategory CUSTOM_URL", async () => {
    props.control.data.path.fsCategory = "CUSTOM_URL";
    component = await mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
      global: { stubs: { CustomUrlFileChooser, Label } },
    });
    const wrapper = component.wrapper;
    expect(wrapper.findComponent(ValueSwitch).vm.modelValue).toBe("CUSTOM_URL");
    const customUrlFileChooser = wrapper.findComponent(CustomUrlFileChooser);
    const url = customUrlFileChooser.findComponent(InputField);
    const timeoutLabel = customUrlFileChooser.findComponent(NumberInput);
    const timeout = customUrlFileChooser.findComponent(NumberInput);
    expect(url.props().modelValue).toBe(props.control.data.path.path);
    expect(timeout.props().modelValue).toBe(props.control.data.path.timeout);
    expect(timeout.attributes().id).toBe(timeoutLabel.vm.labelForId);

    const newTimeout = 1001;
    timeout.vm.$emit("update:modelValue", newTimeout);
    expect(component.updateData).toHaveBeenCalledWith(
      expect.anything(),
      "test",
      {
        path: {
          fsCategory: "CUSTOM_URL",
          path: "myPath",
          timeout: newTimeout,
        },
      },
    );

    const newUrl = 1001;
    url.vm.$emit("update:modelValue", newUrl);
    expect(component.updateData).toHaveBeenCalledWith(
      expect.anything(),
      "test",
      {
        path: {
          fsCategory: "CUSTOM_URL",
          path: newUrl,
          timeout: 1000,
        },
      },
    );
  });

  it("renders with non-supported fsCategory", async () => {
    const stringRepresentation = "myStringRepresentation";
    props.control.data.path.fsCategory = "RELATIVE";
    props.control.data.path.context = { fsToString: stringRepresentation };
    component = await mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
      global: { stubs: { CustomUrlFileChooser, Label } },
    });
    const wrapper = component.wrapper;
    expect(wrapper.findComponent(ValueSwitch).exists()).toBeFalsy();
    const inputField = wrapper.findComponent(InputField);
    expect(inputField.props()).toMatchObject({
      disabled: true,
      modelValue: stringRepresentation,
    });
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
      withControllingFlowVariable: `${props.control.path}.path`,
    });
    expect(wrapper.findComponent(ValueSwitch).props().disabled).toBe(true);
    expect(
      wrapper.findComponent(StringFileChooserInputWithExplorer).props()
        .disabled,
    ).toBe(true);
  });

  it("sets default data when unsetting controlling flow variable", async () => {
    const stringRepresentation = "myStringRepresentation";
    props.control.data.path.fsCategory = "RELATIVE";
    props.control.data.path.context = { fsToString: stringRepresentation };
    const { flowVariablesMap, wrapper, updateData } =
      await mountJsonFormsComponent(LabeledFileChooserInput, {
        props,
        withControllingFlowVariable: `${props.control.path}.path`,
        global: { stubs: { CustomUrlFileChooser, Label } },
      });
    flowVariablesMap[`${props.control.path}.path`].controllingFlowVariableName =
      null;
    wrapper.vm.control = { ...wrapper.vm.control };
    await flushPromises();
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      props.control.path,
      {
        path: {
          path: "",
          fsCategory: "LOCAL",
          timeout: 10000,
        },
      },
    );
  });
});
