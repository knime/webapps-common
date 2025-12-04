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

import { KdsCheckbox } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import CheckboxControl from "../CheckboxControl.vue";

describe("CheckboxControl", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof CheckboxControl>,
    changeValue: Mock;

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: true,
        schema: {
          properties: {
            showTooltip: {
              type: "boolean",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/showTooltip",
          options: {
            format: "checkbox",
          },
        },
      },
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
    const component = await mountJsonFormsControl(CheckboxControl, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(KdsCheckbox).exists()).toBe(true);
  });

  it("calls changeValue when checkbox is changed", async () => {
    await wrapper.getComponent(KdsCheckbox).vm.$emit("update:modelValue", true);
    expect(changeValue).toHaveBeenCalledWith(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.getComponent(KdsCheckbox).props().modelValue).toBe(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.getComponent(KdsCheckbox).props().label).toBe(
      props.control.label,
    );
  });
});
