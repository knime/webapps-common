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
    expect(wrapper.findComponent(NumberInput).exists()).toBe(true);
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

  it("rounds to minimum on focusout", () => {
    const minimum = 100;
    props.control.uischema.options!.min = minimum;
    props.control.data = minimum - 1;
    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
      },
    );
    wrapper.findComponent(NumberInput).vm.$emit("focusout");
    expect(changeValue).toHaveBeenCalledWith(minimum);
  });

  it("rounds to maximum on focusout", () => {
    const maximum = 100;
    props.control.uischema.options!.max = maximum;
    props.control.data = maximum + 1;
    const { wrapper, changeValue } = mountJsonFormsControlLabelContent(
      NumberControl,
      {
        props,
      },
    );
    wrapper.findComponent(NumberInput).vm.$emit("focusout");
    expect(changeValue).toHaveBeenCalledWith(maximum);
  });

  it("sets the minimum via state provider", async () => {
    props.control.uischema.options!.minProvider = "someMinProviderID";
    let provideMin: (value: number) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMin = callback;
    });
    const { wrapper, onRegisterValidation } = mountJsonFormsControlLabelContent(
      NumberControlBase,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    const registeredValidation = onRegisterValidation.mock.calls[0][0];
    expect(unref(registeredValidation)(0).errors).toStrictEqual([]);
    provideMin!(42);
    await flushPromises();
    expect(wrapper.findComponent(NumberInput).props().min).toBe(42);
    expect(unref(registeredValidation)(0).errors).toStrictEqual([
      "The value has to be at least 42",
    ]);
  });

  it("sets the maximum via state provider", async () => {
    props.control.uischema.options!.maxProvider = "someMinProviderID";
    let provideMax: (value: number) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideMax = callback;
    });
    const { wrapper, onRegisterValidation } = mountJsonFormsControlLabelContent(
      NumberControlBase,
      {
        props,
        provide: { addStateProviderListener },
      },
    );
    const registeredValidation = onRegisterValidation.mock.calls[0][0];
    expect(unref(registeredValidation)(0).errors).toStrictEqual([]);
    provideMax!(42);
    await flushPromises();
    expect(wrapper.findComponent(NumberInput).props().max).toBe(42);
    expect(unref(registeredValidation)(100).errors).toStrictEqual([
      "The value has to be 42 at max",
    ]);
  });
});
