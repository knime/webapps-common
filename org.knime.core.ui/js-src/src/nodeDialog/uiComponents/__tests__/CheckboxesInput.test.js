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
import CheckboxesInput from "../CheckboxesInput.vue";
import ErrorMessage from "../ErrorMessage.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";
import Checkboxes from "webapps-common/ui/components/forms/Checkboxes.vue";

describe("CheckboxesInput.vue", () => {
  let wrapper,
    onChangeSpy,
    defaultProps,
    component,
    dirtySettingsMock,
    updateData;

  beforeAll(() => {
    onChangeSpy = vi.spyOn(CheckboxesInput.methods, "onChange");
  });

  beforeEach(async () => {
    defaultProps = {
      control: {
        path: "test",
        enabled: true,
        visible: true,
        label: "defaultLabel",
        data: ["ADDED"],
        schema: {
          title: "Action",
          anyOf: [
            {
              const: "ADDED",
              title: "Added",
            },
            {
              const: "UPDATED",
              title: "Modified",
            },
            {
              const: "REMOVED",
              title: "Deleted",
            },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/model/considerFile",
          options: {
            format: "checkboxes",
            checkboxLayout: "vertical",
          },
        },
        rootSchema: {
          hasNodeView: true,
          flowVariablesMap: {},
        },
      },
    };
    dirtySettingsMock = vi.fn();
    component = await mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
      modules: {
        "pagebuilder/dialog": {
          actions: { dirtySettings: dirtySettingsMock },
          namespaced: true,
        },
      },
    });
    wrapper = component.wrapper;
    updateData = component.updateData;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(CheckboxesInput).exists()).toBe(true);
    expect(wrapper.getComponent(Checkboxes).exists()).toBe(true);
    expect(wrapper.getComponent(ErrorMessage).exists()).toBe(true);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("renders the description popover", async () => {
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(false);
    wrapper.vm.control = { ...defaultProps.control, description: "foo" };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(DescriptionPopover).exists()).toBe(true);
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls onChange when checkbox is changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED", "MODIFIED"]);
    expect(onChangeSpy).toHaveBeenCalledWith(["ADDED", "MODIFIED"]);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      ["ADDED", "MODIFIED"],
    );
    expect(dirtySettingsMock).toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", async () => {
    await wrapper
      .findComponent(Checkboxes)
      .vm.$emit("update:modelValue", ["ADDED"]);
    expect(onChangeSpy).toHaveBeenCalledWith(["ADDED"]);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      ["ADDED"],
    );

    expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
  });

  it("checks that re-execution icon is present if it is a model setting", () => {
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkboxes).vm.modelValue).toStrictEqual(
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
    const { wrapper } = mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });

  it("does not render CheckboxesInput when visible is false", async () => {
    wrapper.vm.control = {
      ...defaultProps.control,
      visible: false,
      errors: "errors",
      description: "description",
    };
    await wrapper.vm.$nextTick(); // wait until pending promises are resolved
    expect(wrapper.findComponent(Checkboxes).exists()).toBe(false);
    expect(wrapper.findComponent(ErrorMessage).exists()).toBe(false);
    expect(wrapper.findComponent(ReexecutionIcon).exists()).toBe(false);
  });

  it("checks that it is not rendered if it is an advanced setting", () => {
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(CheckboxesInput).isVisible()).toBe(false);
  });

  it("checks that it is rendered if it is an advanced setting and advanced settings are shown", () => {
    defaultProps.control.rootSchema.showAdvancedSettings = true;
    defaultProps.control.uischema.options.isAdvanced = true;
    const { wrapper } = mountJsonFormsComponent(CheckboxesInput, {
      props: defaultProps,
    });
    expect(wrapper.getComponent(CheckboxesInput).isVisible()).toBe(true);
  });
});
