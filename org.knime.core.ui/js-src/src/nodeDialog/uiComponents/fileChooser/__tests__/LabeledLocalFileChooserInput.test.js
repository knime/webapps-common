import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import LabeledLocalFileChooserInput from "../LabeledLocalFileChooserInput.vue";
import LabeledInput from "../../label/LabeledInput.vue";
import DialogLabel from "../../label/DialogLabel.vue";
import LocalFileChooserInput from "../LocalFileChooserInput.vue";

describe("LabeledLocalFileChooserInput.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
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
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(LocalFileChooserInput).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls updateData when text input is changed", () => {
    const setDirtyModeSettingsMock = vi.fn();
    const { wrapper, updateData } = mountJsonFormsComponent(
      LabeledLocalFileChooserInput,
      {
        props: defaultProps,
        provide: { setDirtyModeSettingsMock },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(LocalFileChooserInput)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(updateData).toHaveBeenCalledWith(
      expect.anything(),
      defaultProps.control.path,
      changedTextInput,
    );
    expect(setDirtyModeSettingsMock).not.toHaveBeenCalled();
  });

  it("indicates model settings change when model setting is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
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
        provide: { setDirtyModelSettingsMock },
      },
    );
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(LocalFileChooserInput)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(setDirtyModelSettingsMock).toHaveBeenCalledWith();
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
    const { wrapper } = mountJsonFormsComponent(LabeledLocalFileChooserInput, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
