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

import { ValueSwitch } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import RadioControlBase from "../RadioControlBase.vue";
import ValueSwitchControl from "../ValueSwitchControl.vue";

describe("ValueSwitchControl.vue", () => {
  let props: VueControlTestProps<typeof ValueSwitchControl>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "valueSwitchControlLabel";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase("test"),
        data: "LOG",
        schema: {
          oneOf: [
            { const: "LOG", title: "Logarithmic" },
            { const: "VALUE", title: "Linear" },
          ],
        },
        uischema: {
          type: "Control",
          scope: "#/properties/yAxisScale",
          options: {
            format: "valueSwitch",
          },
        },
      },
      disabled: false,
      labelForId,
    };

    const component = await mountJsonFormsControlLabelContent(
      ValueSwitchControl,
      {
        props,
      },
    );
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(ValueSwitch).exists()).toBe(true);
    expect(wrapper.findComponent(RadioControlBase).exists()).toBe(true);
  });

  it("calls changeValue when value is switched", () => {
    wrapper.findComponent(ValueSwitch).vm.$emit("update:modelValue", "VALUE");
    expect(changeValue).toHaveBeenCalledWith("VALUE");
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(ValueSwitch).props().id).toBe(labelForId);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(ValueSwitch).props().modelValue).toBe("LOG");
  });

  it("calls changeValue when radio button is changed", () => {
    wrapper.findComponent(ValueSwitch).vm.$emit("update:modelValue", "VALUE");
    expect(changeValue).toHaveBeenCalledWith("VALUE");
  });
});
