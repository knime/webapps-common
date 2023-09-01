import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import CheckboxInput from "../CheckboxInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import FlowVariableIcon from "../flowVariables/FlowVariableIcon.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import BothFlowVariables from "webapps-common/ui/assets/img/icons/both-flow-variables.svg";
import OnlyFlowVariable from "webapps-common/ui/assets/img/icons/only-flow-variables.svg";
import ExposeFlowVariable from "webapps-common/ui/assets/img/icons/expose-flow-variables.svg";
import flushPromises from "flush-promises";

describe("CheckboxInput.vue", () => {
  let wrapper, onChangeSpy, defaultProps, component;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(CheckboxInput.methods, "onChange");
  });

  beforeEach(async () => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        data: true,
        schema: {
          properties: {
            showTooltip: {
              type: "boolean",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/showTooltip",
          options: {
            format: "checkbox",
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };
    component = await mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CheckboxInput).exists()).toBe(true);
    expect(wrapper.getComponent(Checkbox).exists()).toBe(true);
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
  });

  it("renders the description popover", async () => {
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.vm.control.description = "foo";
    await flushPromises(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when checkbox is changed", async () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    await wrapper.findComponent(Checkbox).vm.$emit("update:modelValue", true);
    expect(onChangeSpy).toHaveBeenCalledWith(true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      true,
    );
    expect(dirtySettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", async () => {
    const dirtySettingsMock = vi.fn();
    const { wrapper, updateData } = await mountJsonFormsComponent(
      CheckboxInput,
      {
        props: {
          ...defaultProps,
          control: {
            ...defaultProps.control,
            uischema: {
              ...defaultProps.control.schema,
              scope: "#/properties/model/filterMissingValues",
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
    await wrapper.findComponent(Checkbox).vm.$emit("update:modelValue", true);
    expect(onChangeSpy).toHaveBeenCalledWith(true);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      true,
    );
    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("checks that re-execution icon is present if it is a model setting", async () => {
    const { wrapper } = await mountJsonFormsComponent(CheckboxInput, {
      props: {
        ...defaultProps,
        control: {
          ...defaultProps.control,
          uischema: {
            ...defaultProps.control.schema,
            scope: "#/properties/model/filterMissingValues",
          },
        },
      },
    });
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkbox).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("disables input when controlled by a flow variable", () => {
    defaultProps.control.rootSchema.flowVariablesMap[
      defaultProps.control.path
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };
    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("renders both icons when controlled and exposed by a flow variable", () => {
    defaultProps.control.rootSchema.flowVariablesMap[
      defaultProps.control.path
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: "test",
      leaf: true,
    };

    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(wrapper.findComponent(FlowVariableIcon).vm.isControlled).toBe(true);
    expect(wrapper.findComponent(FlowVariableIcon).vm.isExposed).toBe(true);

    const icon = wrapper.findComponent(BothFlowVariables);
    expect(icon.exists()).toBe(true);
  });

  it("renders exposedFlowVariable icon when exposed flow variable exists", () => {
    defaultProps.control.rootSchema.flowVariablesMap[
      defaultProps.control.path
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: null,
      exposedFlowVariableName: "test",
      leaf: true,
    };

    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(
      Boolean(
        wrapper.findComponent(FlowVariableIcon).vm.isControlledByFlowVariable,
      ),
    ).toBe(false);
    expect(wrapper.findComponent(FlowVariableIcon).vm.isExposed).toBe(true);

    const icon = wrapper.findComponent(ExposeFlowVariable);
    expect(icon.exists()).toBe(true);
  });

  it("renders onlyFlowVariable icon when controlled by a flow variable", () => {
    defaultProps.control.rootSchema.flowVariablesMap[
      defaultProps.control.path
    ] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "knime.test",
      exposedFlowVariableName: null,
      leaf: true,
    };

    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(wrapper.findComponent(FlowVariableIcon).vm.isControlled).toBe(true);
    expect(
      Boolean(wrapper.findComponent(FlowVariableIcon).vm.isExposedFlowVariable),
    ).toBe(false);

    const icon = wrapper.findComponent(OnlyFlowVariable);
    expect(icon.exists()).toBe(true);
  });

  it("does not render content of CheckboxInput when visible is false", async () => {
    wrapper.vm.control = {
      ...defaultProps.control,
      visible: false,
      errors: "errors",
      description: "description",
    };
    await flushPromises();
    expect(wrapper.findComponent(Checkbox).exists()).toBe(false);
    expect(wrapper.findComponent(ErrorMessage).exists()).toBe(false);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
  });

  it("checks that it is not rendered if it is an advanced setting", () => {
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(CheckboxInput).isVisible()).toBe(false);
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    defaultProps.control.rootSchema.showAdvancedSettings = true;
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(CheckboxInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(CheckboxInput).isVisible()).toBe(true);
  });
});
