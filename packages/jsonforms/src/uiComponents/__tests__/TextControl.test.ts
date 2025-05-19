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
import { flushPromises } from "@vue/test-utils";

import { InputField } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import TextControl from "../TextControl.vue";

describe("TextControl.vue", () => {
  let props: VueControlTestProps<typeof TextControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "labelForId";

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
      labelForId,
    };

    const component = await mountJsonFormsControlLabelContent(TextControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(InputField).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(InputField).props().id).toBe(labelForId);
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

  it("sets correct placeholder text", () => {
    props.control.uischema.options!.placeholder = "Bond";
    const { wrapper } = mountJsonFormsControlLabelContent(TextControl, {
      props,
    });
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });

  it("sets correct placeholder from provider", async () => {
    props.control.uischema.providedOptions = ["placeholder"];

    let providePlaceholder: (placeholder: string) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      providePlaceholder = callback;
    });

    const { wrapper } = mountJsonFormsControlLabelContent(TextControl, {
      props,
      provide: { addStateProviderListener },
    });
    providePlaceholder!("Bond");
    await flushPromises();
    expect(wrapper.findComponent(InputField).props("placeholder")).toBe("Bond");
  });

  it("validates pattern if given", () => {
    const pattern = ".";
    const patternErrorMessage = `The value has to match the pattern "${pattern}"`;
    props.control.uischema.options!.validation = {
      pattern: {
        parameters: { pattern },
        errorMessage: patternErrorMessage,
      },
    };
    const { onRegisterValidation } = mountJsonFormsControlLabelContent(
      TextControl,
      {
        props,
      },
    );
    const validator = onRegisterValidation.mock.calls[0][0];
    expect(validator("aa").errors[0]).toBe(patternErrorMessage);
    expect(validator("b").errors).toStrictEqual([]);
  });

  it.each([
    ["minLength", "aa", "bbbbb"],
    ["maxLength", "aaaaaa", "bbbbb"],
  ])("validates %s if given", (key, invalidEx, validEx) => {
    const length = 5;
    const errorMessage = `${key} is ${length}`;
    props.control.uischema.options!.validation = {
      [key]: {
        parameters: { [key]: length },
        errorMessage,
      },
    };
    const { onRegisterValidation } = mountJsonFormsControlLabelContent(
      TextControl,
      {
        props,
      },
    );
    const validator = onRegisterValidation.mock.calls[0][0];
    expect(validator(invalidEx).errors[0]).toBe(errorMessage);
    expect(validator(validEx).errors).toStrictEqual([]);
  });
});
