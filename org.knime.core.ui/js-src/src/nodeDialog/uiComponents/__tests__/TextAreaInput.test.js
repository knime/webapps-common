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
import TextAreaInput from "../TextAreaInput.vue";
import LabeledInput from "../LabeledInput.vue";
import TextArea from "webapps-common/ui/components/forms/TextArea.vue";

describe("TextInput.vue", () => {
  let defaultProps, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(TextAreaInput.methods, "onChange");
  });

  beforeEach(async () => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        data: "test",
        schema: {
          properties: {
            xAxisLabel: {
              type: "string",
              title: "X Axis Label",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/xAxisLabel",
          options: {
            isAdvanced: false,
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };

    component = await mountJsonFormsComponent(TextAreaInput, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  const changedTextInput = "Shaken not stirred";

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(TextAreaInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(TextArea).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const labeldInput = wrapper.findComponent(LabeledInput);
    expect(wrapper.getComponent(TextArea).props().id).toBe(
      labeldInput.vm.labelForId,
    );
    expect(labeldInput.vm.labeledElement).toBeDefined();
    expect(labeldInput.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when text area is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(TextAreaInput, {
      props: defaultProps,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    const changedTextArea = "Shaken not stirred";
    wrapper
      .findComponent(TextArea)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(onChangeSpy).toHaveBeenCalledWith(changedTextArea);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedTextArea,
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(TextAreaInput, {
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
    });
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(TextArea)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedTextInput,
    );
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(TextArea).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
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
    const { wrapper } = mountJsonFormsComponent(TextAreaInput, {
      props: localDefaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of TextInput when visible is false", async () => {
    wrapper.setProps({ control: { ...defaultProps.control, visible: false } });
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });

  it("checks that it is not rendered if it is an advanced setting", () => {
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(TextAreaInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(TextAreaInput).isVisible()).toBe(false);
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    defaultProps.control.rootSchema.showAdvancedSettings = true;
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(TextAreaInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(TextAreaInput).isVisible()).toBe(true);
  });
});
