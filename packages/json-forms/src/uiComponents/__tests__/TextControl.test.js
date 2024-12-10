import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { InputField } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import TextControl from "../TextControl.vue";
import DialogLabel from "../label/DialogLabel.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("TextControl.vue", () => {
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

    component = await mountJsonFormsComponent(TextControl, {
      props: defaultProps,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(TextControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(InputField).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(InputField).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  it("calls handleChange when text input is changed", () => {
    const setDirtyModelSettingsMock = vi.fn();
    const { wrapper, handleChange } = mountJsonFormsComponent(TextControl, {
      props: defaultProps,
      provide: { setDirtyModelSettingsMock },
    });
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(InputField)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(handleChange).toHaveBeenCalledWith(
      defaultProps.control.path,
      changedTextInput,
    );
    expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(InputField).vm.modelValue).toBe(
      defaultProps.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(defaultProps.control.label);
  });

  it("sets correct placeholder text", () => {
    defaultProps.control.uischema.options.placeholder = "Bond";
    const { wrapper } = mountJsonFormsComponent(TextControl, {
      props: defaultProps,
    });
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });

  it("sets correct placeholder from provider", async () => {
    defaultProps.control.uischema.options.placeholderProvider =
      "somePlaceholderID";

    let providePlaceholder;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      providePlaceholder = callback;
    });

    const { wrapper } = mountJsonFormsComponent(TextControl, {
      props: defaultProps,
      provide: { addStateProviderListenerMock },
    });
    providePlaceholder("Bond");
    await flushPromises();
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });

  it("disables input when controlled by a flow variable", () => {
    const { wrapper } = mountJsonFormsComponent(TextControl, {
      props: defaultProps,
      withControllingFlowVariable: true,
    });
    expect(wrapper.vm.disabled).toBeTruthy();
  });
});
