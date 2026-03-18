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

import { Tooltip } from "@knime/components";
import { KdsNumberInput } from "@knime/kds-components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../../testUtils/component";
import ResourceControlBase from "../ResourceControlBase.vue";
import SmallDonutChart from "../SmallDonutChart.vue";

describe("ResourceControlBase", () => {
  let props: VueControlTestProps<typeof ResourceControlBase>,
    wrapper: VueWrapper,
    changeValue: Mock;

  const labelForId = "myLabelForId";
  const path = "resourcePath";

  beforeEach(() => {
    props = {
      control: {
        ...getControlBase(path),
        data: 5,
        schema: {
          type: "number",
          minimum: 1,
          maximum: 10,
        },
        uischema: {
          type: "Control",
          scope: `#/properties/${path}`,
          options: {
            donutMax: 20,
            step: 1,
            unit: "GB",
          },
        },
      },
      labelForId,
      disabled: false,
      isValid: true,
    };
    const component = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders number input with correct props", () => {
    const numberInput = wrapper.getComponent(KdsNumberInput);
    expect(numberInput.props()).toMatchObject({
      modelValue: 5,
      min: 1,
      max: 10,
      step: 1,
      unit: "GB",
    });
  });

  it("renders donut chart by default", () => {
    expect(wrapper.findComponent(SmallDonutChart).exists()).toBe(true);
  });

  it("hides donut chart when showDonut is false", () => {
    props.control.uischema.options!.showDonut = false;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    expect(wrapper.findComponent(SmallDonutChart).exists()).toBe(false);
  });

  it("passes correct props to donut chart", () => {
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props()).toMatchObject({
      value: 5,
      secondaryValue: 0,
      maxValue: 20,
      animate: true,
    });
  });

  it("uses currentUsage from options for donut chart value", () => {
    props.control.uischema.options!.currentUsage = 3;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props().value).toBe(3);
  });

  it("uses secondaryValue from schema", () => {
    (props.control.schema as { secondaryValue?: number }).secondaryValue = 7;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props().secondaryValue).toBe(7);
  });

  it("uses data as donut max when modelMax is true", () => {
    props.control.uischema.options!.modelMax = true;
    props.control.data = 15;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props().maxValue).toBe(15);
  });

  it("falls back to schema maximum for donut max when donutMax not provided", () => {
    delete props.control.uischema.options!.donutMax;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props().maxValue).toBe(10);
  });

  it("disables animation when animate is false", () => {
    props.control.uischema.options!.animate = false;
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const donutChart = wrapper.getComponent(SmallDonutChart);
    expect(donutChart.props().animate).toBe(false);
  });

  it("calls changeValue when number input is changed", () => {
    const newValue = 8;
    wrapper
      .getComponent(KdsNumberInput)
      .vm.$emit("update:modelValue", newValue);
    expect(changeValue).toHaveBeenCalledWith(newValue);
  });

  it("uses default values for min, max, step, and unit when not provided", () => {
    props.control.schema = { type: "number" };
    props.control.uischema.options = {};
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const numberInput = wrapper.getComponent(KdsNumberInput);
    expect(numberInput.props()).toMatchObject({
      min: 0,
      max: Infinity,
      step: 1,
      unit: "",
    });
  });

  it("renders tooltip when disabled with disabledTooltip", () => {
    props.control.uischema.options!.disabled = true;
    props.control.uischema.options!.disabledTooltip = "Resource unavailable";
    const { wrapper } = mountJsonFormsControlLabelContent(ResourceControlBase, {
      props,
    });
    const tooltip = wrapper.findComponent(Tooltip);
    expect(tooltip.exists()).toBe(true);
    expect(tooltip.props().text).toBe("Resource unavailable");
  });

  it("renders div instead of tooltip when not disabled", () => {
    const tooltip = wrapper.findComponent(Tooltip);
    expect(tooltip.exists()).toBe(false);
    expect(wrapper.find(".input-wrapper").exists()).toBe(true);
  });
});
