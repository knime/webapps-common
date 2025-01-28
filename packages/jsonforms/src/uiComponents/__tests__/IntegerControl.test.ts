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

import { NumberInput } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import IntegerControl from "../IntegerControl.vue";

describe("IntegerControl.vue", () => {
  let props: VueControlTestProps<typeof IntegerControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "integerControlLabel";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("path"),
        data: 5,
        schema: {
          properties: {
            maxRows: {
              type: "integer",
              title: "Show tooltip",
            },
          },
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/maxRows",
          options: {
            format: "integer",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: false,
    };
    const component = await mountJsonFormsControlLabelContent(IntegerControl, {
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
    expect(wrapper.getComponent(NumberInput).props().modelValue).toBe(5);
    expect(wrapper.getComponent(NumberInput).props().disabled).toBe(false);
    expect(wrapper.getComponent(NumberInput).props().type).toBe("integer");
  });

  it("calls changeValue when value is changed", () => {
    wrapper.getComponent(NumberInput).vm.$emit("update:modelValue", 10);
    expect(changeValue).toHaveBeenCalledWith(10);
  });
});
