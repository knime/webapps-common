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
import DateTimeInput from "../DateTimeInput.vue";
import LabeledInput from "../LabeledInput.vue";
import DateTimeInputBase from "webapps-common/ui/components/forms/DateTimeInput.vue";

describe("DateTimeInput.vue", () => {
  let defaultProps, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(DateTimeInput.methods, "onChange");
  });

  beforeEach(() => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        data: "2022-12-12T20:22:22.000Z",
        schema: {
          properties: {
            dateTime: {
              type: "string",
              format: "date-time",
              title: "date&time",
            },
          },
          default: "default value",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/dateTime",
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

    component = mountJsonFormsComponent(DateTimeInput, { props: defaultProps });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(DateTimeInput).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(wrapper.findComponent(DateTimeInputBase).exists()).toBe(true);
  });

  it("sets labelForId", async () => {
    await wrapper.vm.$nextTick();
    const labeldInput = wrapper.findComponent(LabeledInput);
    expect(wrapper.getComponent(DateTimeInputBase).props().id).toBe(
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
    const { wrapper, updateData } = mountJsonFormsComponent(DateTimeInput, {
      props: defaultProps,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    const changedDateTimeInput = new Date("2022-12-12T20:22:22.000Z");
    wrapper
      .findComponent(DateTimeInputBase)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(onChangeSpy).toHaveBeenCalledWith(changedDateTimeInput);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedDateTimeInput,
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(DateTimeInput, {
      props: {
        ...defaultProps,
        control: {
          ...defaultProps.control,
          uischema: {
            ...defaultProps.control.schema,
            scope: "#/properties/model/properties/dateTime",
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
    const changedDateTimeInput = "Shaken not stirred";
    wrapper
      .findComponent(DateTimeInputBase)
      .vm.$emit("update:modelValue", changedDateTimeInput);
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedDateTimeInput,
    );
  });

  it("sets correct initial value", () => {
    expect(
      wrapper.findComponent(DateTimeInputBase).vm.modelValue,
    ).toStrictEqual(new Date(defaultProps.control.data));
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
    const { wrapper } = mountJsonFormsComponent(DateTimeInput, {
      props: localDefaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render content of DateTimeInput when visible is false", async () => {
    wrapper.vm.control = { ...defaultProps.control, visible: false };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });

  it("checks that it is not rendered if it is an advanced setting", () => {
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(DateTimeInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(DateTimeInput).isVisible()).toBe(false);
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    defaultProps.control.rootSchema.showAdvancedSettings = true;
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(DateTimeInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(DateTimeInput).isVisible()).toBe(true);
  });
});
