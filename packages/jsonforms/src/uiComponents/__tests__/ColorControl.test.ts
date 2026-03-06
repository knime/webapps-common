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

import { KdsColorInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils";
import ColorControl from "../ColorControl.vue";

describe("ColorControl", () => {
  let props: VueControlTestProps<typeof ColorControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "colorControlLabel";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase("test"),
        data: "#FF00FF",
        schema: {
          properties: {
            color: {
              type: "string",
              title: "Color",
            },
          },
          default: "#FFFFFF",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/color",
          options: {
            format: "color",
          },
        },
      },
      disabled: false,
      isValid: false,
      labelForId,
    };

    const component = mountJsonFormsControlLabelContent(ColorControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(KdsColorInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsColorInput).props().id).toBe(labelForId);
  });

  it("calls changeValue when color input is changed", () => {
    const changedColor = "#AABBCC";
    wrapper
      .findComponent(KdsColorInput)
      .vm.$emit("update:modelValue", changedColor);
    expect(changeValue).toHaveBeenCalledWith(changedColor);
  });

  it("sets correct initial value", () => {
    expect(wrapper.getComponent(KdsColorInput).props("modelValue")).toBe(
      props.control.data,
    );
  });
});
