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

import { Checkbox } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import CheckboxControl from "../CheckboxControl.vue";

describe("CheckboxControl.vue", () => {
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
    expect(wrapper.findComponent(Checkbox).exists()).toBe(true);
  });

  it("calls changeValue when checkbox is changed", async () => {
    await wrapper.findComponent(Checkbox).vm.$emit("update:modelValue", true);
    expect(changeValue).toHaveBeenCalledWith(true);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Checkbox).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });
});
