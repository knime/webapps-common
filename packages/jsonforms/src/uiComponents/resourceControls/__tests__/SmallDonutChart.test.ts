import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import SmallDonutChart from "../SmallDonutChart.vue";

describe("SmallDonutChart", () => {
  const defaultValue = 3;
  const defaultMaxValue = 10;

  it("renders with default settings", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: defaultValue,
        maxValue: defaultMaxValue,
      },
    });
    expect(wrapper.exists()).toBe(true);

    expect(wrapper.find("svg").exists()).toBe(true);
    const bgCircle = wrapper.find("circle.background-circle");
    expect(bgCircle.exists()).toBe(true);

    const wedge = wrapper.find("circle.value-wedge.primary-segment");
    expect(wedge.exists()).toBe(true);
    expect(wedge.classes()).toContain("animate");
  });

  it("renders with extended values and animation", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: 25,
        secondaryValue: 35,
        animate: true,
        maxValue: 100,
      },
    });
    expect(wrapper.find("svg").exists()).toBe(true);
    const primaryWedge = wrapper.find(".value-wedge.primary-segment");
    const secondaryWedge = wrapper.find(".value-wedge.secondary-segment");

    expect(primaryWedge.exists()).toBe(true);
    expect(secondaryWedge.exists()).toBe(true);

    expect(primaryWedge.classes()).toContain("animate");
    expect(secondaryWedge.classes()).toContain("animate");
  });

  it("does not animate if prop is set to false", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: 45,
        animate: false,
        maxValue: 100,
      },
    });
    expect(wrapper.find("svg").exists()).toBe(true);
    const primaryWedge = wrapper.find(".value-wedge.primary-segment");
    expect(primaryWedge.classes()).not.toContain("animate");
  });

  it("handles infinity as maximum value", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: 42,
        maxValue: Infinity,
      },
    });

    expect(wrapper.find("circle.disabled-circle").exists()).toBe(true);
    expect(
      wrapper.find("circle.disabled-circle").attributes("stroke-width"),
    ).toBe("1");
    expect(
      wrapper.find("circle.disabled-inner-circle").attributes("stroke-width"),
    ).toBe("1");

    expect(wrapper.find("circle.background-circle").exists()).toBe(false);
    expect(wrapper.find("circle.value-wedge").exists()).toBe(false);
  });

  it("handles values larger than maximum when acceptValuesLargerThanMax is true", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: 1021,
        maxValue: defaultMaxValue,
        acceptValuesLargerThanMax: true,
      },
    });

    const wedge = wrapper.find("circle.value-wedge.primary-segment");
    expect(Number(wedge.attributes("stroke-dashoffset"))).toBe(0);
  });

  it("clips values larger than maximum when acceptValuesLargerThanMax is false", () => {
    const wrapper = mount(SmallDonutChart, {
      props: {
        value: 1021,
        maxValue: defaultMaxValue,
        acceptValuesLargerThanMax: false,
      },
    });

    const wedge = wrapper.find("circle.value-wedge.primary-segment");
    expect(Number(wedge.attributes("stroke-dashoffset"))).toBe(0);
  });
});
