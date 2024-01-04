import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  mountJsonFormsComponent,
  initializesJsonFormsControl,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import TextAreaInput from "../TextAreaInput.vue";
import LabeledInput from "../label/LabeledInput.vue";
import DialogLabel from "../label/DialogLabel.vue";
import TextArea from "webapps-common/ui/components/forms/TextArea.vue";

describe("TextInput.vue", () => {
  let defaultProps, wrapper, component;

  beforeEach(async () => {
    defaultProps = {
      control: {
        ...getControlBase("test"),
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
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(TextArea).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls updateData when text area is changed", () => {
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
    const { wrapper } = mountJsonFormsComponent(TextAreaInput, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
