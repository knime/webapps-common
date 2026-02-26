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

import { KdsNumberInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils";
import IntegerControl from "../IntegerControl.vue";

describe("IntegerControl", () => {
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
    expect(wrapper.findComponent(KdsNumberInput).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(KdsNumberInput).props().id).toBe(labelForId);
  });

  it("sets initial value", () => {
    expect(wrapper.getComponent(KdsNumberInput).props().modelValue).toBe(5);
    expect(wrapper.getComponent(KdsNumberInput).props().disabled).toBe(false);
    expect(wrapper.getComponent(KdsNumberInput).props().step).toBe(1);
  });

  it("calls changeValue when value is changed", () => {
    wrapper.getComponent(KdsNumberInput).vm.$emit("update:modelValue", 10);
    expect(changeValue).toHaveBeenCalledWith(10);
  });
});
