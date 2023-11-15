import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledFileChooserInput from "../LabeledFileChooserInput.vue";
import LabeledInput from "../../LabeledInput.vue";
import LocalFileChooserInput from "../LocalFileChooserInput.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import NumberInput from "webapps-common/ui/components/forms/NumberInput.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import CustomUrlFileChooser from "../CustomUrlFileChooser.vue";

describe("LabeledFileChooserInput.vue", () => {
  let props, wrapper, component;

  beforeEach(async () => {
    props = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
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
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
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
    expect(wrapper.findComponent(LocalFileChooserInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const labeldInput = wrapper.findComponent(LabeledInput);
    expect(wrapper.getComponent(LocalFileChooserInput).props().id).toBe(
      labeldInput.vm.labelForId,
    );
    expect(labeldInput.vm.labeledElement).toBeDefined();
    expect(labeldInput.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when local file text input is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(
      LabeledFileChooserInput,
      {
        props,
        modules: {
          "pagebuilder/dialog": {
            actions: { dirtySettings: dirtySettingsMock },
            namespaced: true,
          },
        },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(LocalFileChooserInput)
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
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper } = mountJsonFormsComponent(LabeledFileChooserInput, {
      props: {
        ...props,
        control: {
          ...props.control,
          uischema: {
            ...props.control.schema,
            scope: "#/properties/model/properties/yAxisColumn",
          },
        },
      },
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(LocalFileChooserInput)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(ValueSwitch).vm.modelValue).toBe(
      props.control.data.path.fsCategory,
    );
    expect(wrapper.findComponent(LocalFileChooserInput).vm.modelValue).toBe(
      props.control.data.path.path,
    );
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

  it("disables input when controlled by a flow variable", () => {
    const localDefaultProps = JSON.parse(JSON.stringify(props));
    localDefaultProps.control.rootSchema.flowVariablesMap[
      `${props.control.path}.path`
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };
    const { wrapper } = mountJsonFormsComponent(LabeledFileChooserInput, {
      props: localDefaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of TextInput when visible is false", async () => {
    wrapper.vm.control = { ...props.control, visible: false };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });

  it("does not render if it is an advanced setting", () => {
    props.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
    });
    expect(wrapper.getComponent(LabeledFileChooserInput).isVisible()).toBe(
      false,
    );
  });

  it("renders if it is an advanced setting and advanced settings are shown", () => {
    props.control.rootSchema.showAdvancedSettings = true;
    props.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(LabeledFileChooserInput, {
      props,
    });
    expect(wrapper.getComponent(LabeledFileChooserInput).isVisible()).toBe(
      true,
    );
  });
});
