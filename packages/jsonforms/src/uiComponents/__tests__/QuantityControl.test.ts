import { afterEach, describe, expect, it, vi } from "vitest";

import { KdsNumberInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils";
import QuantityControl from "../QuantityControl.vue";

describe("QuantityControl", () => {
  const path = "quantity";
  const labelForId = "quantity-input";

  const setupRenderer = () => {
    const props: VueControlTestProps<typeof QuantityControl> = {
      control: {
        ...getControlBase(path),
        data: 5,
        schema: {
          properties: {
            quantity: {
              type: "integer",
              title: "Quantity",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: `#/properties/${path}`,
          options: {
            format: "quantity",
          },
        },
      },
      disabled: false,
      labelForId,
      isValid: true,
    };

    const { wrapper, handleChange } = mountJsonFormsControlLabelContent(
      QuantityControl,
      { props },
    );

    return { wrapper, handleChange };
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    const { wrapper } = setupRenderer();
    expect(wrapper.findComponent(KdsNumberInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const { wrapper } = setupRenderer();
    expect(wrapper.getComponent(KdsNumberInput).props().id).toBe(labelForId);
  });

  it("sets initial value", () => {
    const { wrapper } = setupRenderer();
    expect(wrapper.getComponent(KdsNumberInput).props().modelValue).toBe(5);
    expect(wrapper.getComponent(KdsNumberInput).props().disabled).toBe(false);
  });

  it("calls changeValue when value is changed", () => {
    const { wrapper, handleChange } = setupRenderer();
    wrapper.getComponent(KdsNumberInput).vm.$emit("update:modelValue", 10);
    expect(handleChange).toHaveBeenCalledWith(path, 10);
  });
});
