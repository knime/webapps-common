import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { InputField } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import LabeledControl from "../../higherOrderComponents/control/LabeledControl.vue";
import TextControl from "../TextControl.vue";

describe("TextControl.vue", () => {
  let props: VueControlTestProps<typeof TextControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  beforeEach(async () => {
    props = {
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
          options: {},
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };

    const component = await mountJsonFormsControl(TextControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(InputField).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(InputField).props().id).toBeDefined();
  });

  it("calls handleChange when text input is changed", () => {
    const changedTextInput = "Shaken not stirred";
    wrapper
      .findComponent(InputField)
      .vm.$emit("update:modelValue", changedTextInput);
    expect(changeValue).toHaveBeenCalledWith(changedTextInput);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(InputField).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("sets correct placeholder text", () => {
    props.control.uischema.options!.placeholder = "Bond";
    const { wrapper } = mountJsonFormsControl(TextControl, {
      props,
    });
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });

  it("sets correct placeholder from provider", async () => {
    props.control.uischema.options!.placeholderProvider = "somePlaceholderID";

    let providePlaceholder: (placeholder: string) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      providePlaceholder = callback;
    });

    const { wrapper } = mountJsonFormsControl(TextControl, {
      props,
      provide: { addStateProviderListener },
    });
    providePlaceholder!("Bond");
    await flushPromises();
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });
});
