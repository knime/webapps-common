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
import NumberInput from "../NumberInput.vue";
import NumberInputBase from "../NumberInputBase.vue";
import NumberInputComponent from "webapps-common/ui/components/forms/NumberInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import LabeledInput from "../LabeledInput.vue";

describe("NumberInput.vue", () => {
  let props, wrapper, onChangeSpy, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(NumberInputBase.methods, "onChange");
  });

  beforeEach(() => {
    props = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        schema: {
          properties: {
            maxRows: {
              type: "double",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "double",
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };

    component = mountJsonFormsComponent(NumberInput, { props });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(NumberInput).exists()).toBe(true);
    expect(wrapper.getComponent(NumberInputBase).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(true);
    expect(
      wrapper.getComponent(NumberInput).getComponent(ErrorMessage).exists(),
    ).toBe(true);
  });

  it("sets labelForId", () => {
    const labeldInput = wrapper.findComponent(LabeledInput);
    expect(wrapper.getComponent(NumberInputComponent).props().id).toBe(
      labeldInput.vm.labelForId,
    );
    expect(labeldInput.vm.labeledElement).toBeDefined();
    expect(labeldInput.vm.labeledElement).not.toBeNull();
  });

  it("passes default props", () => {
    const numberInputProps = wrapper.getComponent(NumberInputBase).props();
    expect(numberInputProps.type).toBe("double");
  });

  it("initializes jsonforms on pass-through component", () => {
    initializesJsonFormsControl({
      wrapper: wrapper.getComponent(NumberInputBase),
      useJsonFormsControlSpy: component.useJsonFormsControlSpy,
    });
  });

  it("calls onChange of NumberInputBase when number input is changed", () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper.findComponent(NumberInputBase).find("input").trigger("input");
    expect(onChangeSpy).toBeCalled();
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const dirtySettingsMock = vi.fn();
    props.control.uischema.scope = "#/properties/model/properties/yAxisColumn";
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper.findComponent(NumberInputBase).find("input").trigger("input");
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("disables numberInputBase when controlled by a flow variable", () => {
    props.control.rootSchema.flowVariablesMap[props.control.path] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };

    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
    });
    expect(wrapper.findComponent(NumberInputBase).vm.disabled).toBeTruthy();
  });

  it("does not render content of NumberInputBase when visible is false", async () => {
    wrapper.findComponent(NumberInputBase).vm.control = {
      ...props.control,
      visible: false,
    };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(LabeledInput).exists()).toBe(false);
  });

  it("rounds to minimum on focusout", () => {
    const minimum = 100;
    props.control.schema.minimum = minimum;
    props.control.data = minimum - 1;
    const component = mountJsonFormsComponent(NumberInput, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInputComponent).vm.$emit("focusout");
    expect(onChangeSpy).toHaveBeenCalledWith(minimum);
  });

  it("rounds to maximum on focusout", () => {
    const maximum = 100;
    props.control.schema.maximum = maximum;
    props.control.data = maximum + 1;
    const component = mountJsonFormsComponent(NumberInput, { props });
    const wrapper = component.wrapper;
    wrapper.findComponent(NumberInputComponent).vm.$emit("focusout");
    expect(onChangeSpy).toHaveBeenCalledWith(maximum);
  });

  it("checks that it is not rendered if it is an advanced setting", () => {
    props.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
    });
    expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(false);
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    props.control.rootSchema.showAdvancedSettings = true;
    props.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(NumberInput, {
      props,
    });
    expect(wrapper.getComponent(NumberInputBase).isVisible()).toBe(true);
  });
});
