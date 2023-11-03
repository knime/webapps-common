import {
  afterEach,
  beforeEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledLocalFileChooserInput from "../LabeledLocalFileChooserInput.vue";
import LabeledInput from "../../LabeledInput.vue";
import LocalFileChooserInput from "../LocalFileChooserInput.vue";

describe("LabeledLocalFileChooserInput.vue", () => {
  let defaultProps, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(LabeledLocalFileChooserInput.methods, "onChange");
  });

  beforeEach(async () => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        data: "test",
        schema: {
          properties: {
            localFile: {
              type: "string",
              title: "Local File",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/localFile",
          options: {
            format: "localFileChooser",
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };

    component = await mountJsonFormsComponent(LabeledLocalFileChooserInput, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(LabeledLocalFileChooserInput).exists()).toBe(
      true,
    );
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
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

  it("calls onChange when text input is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(
      LabeledLocalFileChooserInput,
      {
        props: defaultProps,
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
    expect(onChangeSpy).toHaveBeenCalledWith(changedTextInput);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedTextInput,
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(
      LabeledLocalFileChooserInput,
      {
        props: {
          ...defaultProps,
          control: {
            ...defaultProps.control,
            uischema: {
              ...defaultProps.control.schema,
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
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(LocalFileChooserInput)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedTextInput,
    );
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(LocalFileChooserInput).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });

  it("disables input when controlled by a flow variable", () => {
    const localDefaultProps = JSON.parse(JSON.stringify(defaultProps));
    localDefaultProps.control.rootSchema.flowVariablesMap[
      defaultProps.control.path
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };
    const { wrapper } = mountJsonFormsComponent(LabeledLocalFileChooserInput, {
      props: localDefaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of TextInput when visible is false", async () => {
    wrapper.vm.control = { ...defaultProps.control, visible: false };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });

  it("does not render if it is an advanced setting", () => {
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(LabeledLocalFileChooserInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(LabeledLocalFileChooserInput).isVisible()).toBe(
      false,
    );
  });

  it("renders if it is an advanced setting and advanced settings are shown", () => {
    defaultProps.control.rootSchema.showAdvancedSettings = true;
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(LabeledLocalFileChooserInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(LabeledLocalFileChooserInput).isVisible()).toBe(
      true,
    );
  });
});
