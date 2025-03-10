import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { unref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import { flushPromises } from "@vue/test-utils";

import { NumberInput } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import NumberControl from "../NumberControl.vue";
import NumberControlBase from "../NumberControlBase.vue";

describe("NumberControl.vue", () => {
  let props: VueControlTestProps<typeof NumberControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "numberControlLabel";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: 0.5,
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
      },
      labelForId,
      disabled: false,
      isValid: false,
    };

    const component = mountJsonFormsControlLabelContent(NumberControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    // @ts-ignore
    expect(wrapper.getComponent(NumberInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(NumberInput).props().id).toBe(labelForId);
  });

  it("sets initial value", () => {
    expect(wrapper.getComponent(NumberInput).props().modelValue).toBe(0.5);
    expect(wrapper.getComponent(NumberInput).props().disabled).toBe(false);
    expect(wrapper.getComponent(NumberInput).props().type).toBe("double");
  });

  it("calls changeValue when value is changed", () => {
    wrapper.getComponent(NumberInput).vm.$emit("update:modelValue", 42.0);
    expect(changeValue).toHaveBeenCalledWith(42.0);
  });

  it.each([
    ["inclusive", false, 100],
    ["exclusive", true, 100.1],
  ])("rounds to %s minimum on focusout", async (_, exclusive, result) => {
    const minimum = 100;
    props.control.uischema.options!.min = minimum;
    props.control.uischema.options!.minIsExclusive = exclusive;
    props.control.data = minimum - 1;
    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
      },
    );
    await wrapper.findComponent(NumberControlBase).trigger("focusout");
    expect(changeValue).toHaveBeenCalledWith(result);
  });

  it.each([
    ["inclusive", false, 100],
    ["exclusive", true, 99.9],
  ])("rounds to %s maximum on focusout", async (_, exclusive, result) => {
    const maximum = 100;
    props.control.uischema.options!.max = maximum;
    props.control.uischema.options!.maxIsExclusive = exclusive;
    props.control.data = maximum + 1;
    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
      },
    );
    await wrapper.findComponent(NumberControlBase).trigger("focusout");
    expect(changeValue).toHaveBeenCalledWith(result);
  });

  it("sets the minimum via state provider", async () => {
    props.control.uischema.options!.minProvider = "someMinProviderID";
    let provideMin: (params: { value: number; errorMessage: string }) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMin = callback;
    });
    const { wrapper, onRegisterValidation } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    const errorMessage = "The value has to be at least 42";
    const registeredValidation = onRegisterValidation.mock.calls[0][0];
    expect(unref(registeredValidation)(0).errors).toStrictEqual([]);
    provideMin!({ value: 42, errorMessage });
    await flushPromises();
    expect(wrapper.findComponent(NumberInput).props().min).toBe(42);
    expect(unref(registeredValidation)(0).errors).toStrictEqual([errorMessage]);
  });

  it("sets the maximum via state provider", async () => {
    props.control.uischema.options!.maxProvider = "someMaxProviderID";
    let provideMax: (params: { value: number; errorMessage: string }) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMax = callback;
    });
    const { wrapper, onRegisterValidation } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    const errorMessage = "The value has to be 42 at max";
    const registeredValidation = onRegisterValidation.mock.calls[0][0];
    expect(unref(registeredValidation)(0).errors).toStrictEqual([]);
    provideMax!({ value: 42, errorMessage });
    await flushPromises();
    expect(wrapper.findComponent(NumberInput).props().max).toBe(42);
    expect(unref(registeredValidation)(100).errors).toStrictEqual([
      errorMessage,
    ]);
  });

  it.each([
    ["inclusive", "min", false, 41, 42],
    ["exclusive", "min", true, 42, 43],
    ["inclusive", "max", false, 43, 42],
    ["exclusive", "max", true, 42, 41],
  ])(
    "validates %s %s if given",
    // eslint-disable-next-line max-params
    (_, key, exclusive, invalidEx, validEx) => {
      const length = 42;
      const errorMessage = `${key} is ${length}`;
      props.control.uischema.options![key] = length;
      props.control.uischema.options![`${key}IsExclusive`] = exclusive;
      props.control.uischema.options![`${key}ErrorMessage`] = errorMessage;
      const { onRegisterValidation } = mountJsonFormsControlLabelContent(
        NumberControl,
        {
          props,
        },
      );
      const validator = onRegisterValidation.mock.calls[0][0];
      expect(validator.value(invalidEx).errors[0]).toBe(errorMessage);
      expect(validator.value(validEx).errors).toStrictEqual([]);
    },
  );
});
