/* eslint-disable no-magic-numbers */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";

import TimePartInput from "../TimePartInput.vue";

describe("TimePartInput.vue", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      modelValue: 10,
      min: 0,
      max: 59,
      title: "seconds",
      minDigits: 2,
    };

    wrapper = shallowMount(TimePartInput, {
      props,
    });
  });

  it("renders", () => {
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
  });

  it("renders invalid style", async () => {
    await wrapper.setProps({ isValid: false });
    expect(wrapper.find(".invalid-marker").exists()).toBe(true);
    await wrapper.setProps({ isValid: true });
    expect(wrapper.find(".invalid-marker").exists()).toBe(false);
  });

  it("has validate logic to check min/max values", async () => {
    expect(wrapper.vm.validate().isValid).toBe(true);
    await wrapper.setProps({ modelValue: -5 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    await wrapper.setProps({ modelValue: 65 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    await wrapper.setProps({ modelValue: 5 });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("has validate logic to check non-numeric values", async () => {
    expect(wrapper.vm.validate().isValid).toBe(true);
    await wrapper.setProps({ modelValue: "test" });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is not a number.",
      isValid: false,
    });
  });

  it("prevents changing value with spinners when result would be invalid", async () => {
    expect(wrapper.vm.getValue()).toBe(10);
    await wrapper.setProps({ modelValue: -5 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    await wrapper.vm.changeValue(-1);
    expect(wrapper.vm.getValue()).toBe(-5);
    await wrapper.vm.changeValue(1);
    expect(wrapper.vm.getValue()).toBe(1);
    expect(wrapper.vm.validate().isValid).toBe(true);
    await wrapper.setProps({ modelValue: 65 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    await wrapper.vm.changeValue(1);
    expect(wrapper.vm.getValue()).toBe(65);
    await wrapper.vm.changeValue(-1);
    expect(wrapper.vm.getValue()).toBe(58);
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("increments up and down properly with spinner controls", async () => {
    vi.useFakeTimers();
    let event = {
      type: "mousedown",
    };

    expect(wrapper.vm.getValue()).toBe(10);
    await wrapper.vm.mouseEvent(event, "increase");
    vi.advanceTimersByTime(50);
    await wrapper.vm.mouseEvent({}, "increase");
    expect(wrapper.vm.getValue()).toBe(11);
    await wrapper.vm.mouseEvent(event, "decrease");
    vi.advanceTimersByTime(50);
    await wrapper.vm.mouseEvent({}, "decrease");
    expect(wrapper.vm.getValue()).toBe(10);
  });

  it("pads the value with zeros on the left side if minDigits prop is set", async () => {
    props.modelValue = 11;
    props.minDigits = 5;
    props.max = 100;
    props.min = -100;
    let wrapper2 = mount(TimePartInput, {
      props,
    });
    // formats value on initial render
    const inputElement = wrapper2.find({ ref: "input" }).element;
    expect(inputElement.value).toBe("00011");
    // updates format if prop changes
    await wrapper2.setProps({ modelValue: 22 });
    expect(inputElement.value).toBe("00022");
    // does not format negative values
    await wrapper2.setProps({ modelValue: -65 });
    expect(inputElement.value).toBe("-65");
  });

  it("applies hover class", async () => {
    const input = wrapper.find("input");
    expect(input.classes()).not.toContain("hover");
    await input.trigger("mouseenter");
    expect(input.classes()).toContain("hover");
    await input.trigger("mouseleave");
    expect(input.classes()).not.toContain("hover");
  });

  it("emits @bounds if max value would be exceeded", async () => {
    // does not emit via props
    await wrapper.setProps({ modelValue: 62 });
    expect(wrapper.emitted("bounds")).toBeUndefined();

    // emits using changeValue
    await wrapper.setProps({ modelValue: 59 });
    await wrapper.vm.changeValue(1);
    expect(wrapper.emitted("bounds")[0][0]).toStrictEqual({
      input: 60,
      limit: 59,
      type: "max",
      value: 59,
    });

    // emits via onInput
    await wrapper.setProps({ modelValue: 20 });
    const input = wrapper.find({ ref: "input" });
    input.element.value = "63";
    await input.trigger("input");
    expect(wrapper.emitted("bounds")[1][0]).toStrictEqual({
      input: 63,
      limit: 59,
      type: "max",
      value: 59,
    });
  });

  it("emits @bounds if min value would be exceeded", async () => {
    // does not emit via props
    await wrapper.setProps({ modelValue: -1 });
    expect(wrapper.emitted("bounds")).toBeUndefined();

    // emits using changeValue
    await wrapper.setProps({ modelValue: 0 });
    await wrapper.vm.changeValue(-1);
    expect(wrapper.emitted("bounds")[0][0]).toStrictEqual({
      input: -1,
      limit: 0,
      type: "min",
      value: 0,
    });

    // emits via onInput
    await wrapper.setProps({ modelValue: 0 });
    const input = wrapper.find({ ref: "input" });
    input.element.value = "-5";
    await input.trigger("input");
    expect(wrapper.emitted("bounds")[1][0]).toStrictEqual({
      input: -5,
      limit: 0,
      type: "min",
      value: 0,
    });
  });
});
