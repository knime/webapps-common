import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import NumberInput from "../NumberInput.vue";

describe("NumberInput", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      modelValue: 10,
      stepSize: 1,
      min: 0,
      max: 20,
      title: "knime",
      type: "double",
    };

    wrapper = shallowMount(NumberInput, {
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
    await wrapper.setProps({ modelValue: 25 });
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
    expect(wrapper.vm.getParsedValue()).toBe(10);
    await wrapper.setProps({ modelValue: -5 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    wrapper.vm.changeValue(-1);
    expect(wrapper.vm.getParsedValue()).toBe(-5);
    wrapper.vm.changeValue(1);
    expect(wrapper.vm.getParsedValue()).toBe(1);
    expect(wrapper.vm.validate().isValid).toBe(true);
    await wrapper.setProps({ modelValue: 25 });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Current value is outside allowed range.",
      isValid: false,
    });
    wrapper.vm.changeValue(1);
    expect(wrapper.vm.getParsedValue()).toBe(25);
    wrapper.vm.changeValue(-1);
    expect(wrapper.vm.getParsedValue()).toBe(19);
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("increments up and down properly with spinner controls", () => {
    vi.useFakeTimers();
    let event = {
      type: "mousedown",
    };

    expect(wrapper.vm.getParsedValue()).toBe(10);
    wrapper.vm.mouseEvent(event, "increase");
    vi.advanceTimersByTime(50);
    wrapper.vm.mouseEvent({}, "increase");
    expect(wrapper.vm.getParsedValue()).toBe(10.1);
    wrapper.vm.mouseEvent(event, "decrease");
    vi.advanceTimersByTime(50);
    wrapper.vm.mouseEvent({}, "decrease");
    expect(wrapper.vm.getParsedValue()).toBe(10);
  });

  it("applies hover class", async () => {
    const input = wrapper.find("input");
    expect(input.classes()).not.toContain("hover");
    await input.trigger("mouseenter");
    expect(input.classes()).toContain("hover");
    await input.trigger("mouseleave");
    expect(input.classes()).not.toContain("hover");
  });

  it("transforms to (standard) scientific notation", async () => {
    await wrapper.setProps({ modelValue: "3e5" });
    expect(wrapper.vm.getParsedValue()).toBe(300000);
    await wrapper.setProps({ modelValue: "4.423532523e5" });
    expect(wrapper.vm.getParsedValue()).toBe(442353.2523);
  });

  it("accepts decimal point as separator", async () => {
    const input = wrapper.find("input");
    input.element.value = "1.5";
    await input.trigger("input");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe(1.5);
  });

  it("does not emit a new value when the input is a period", () => {
    const mockEvent = {
      data: ".",
      inputType: "",
      target: {
        modelValue: "",
      },
    };

    wrapper.vm.onInput(mockEvent);
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("does not emit a new value when the input is a minus sign", () => {
    const mockEvent = {
      data: "-",
      inputType: "",
      target: {
        modelValue: "",
      },
    };

    wrapper.vm.onInput(mockEvent);
    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("emits NaN when all digits were deleted", () => {
    const mockEvent = {
      data: null,
      inputType: "deleteContentBackward",
      target: {
        value: "",
      },
    };

    wrapper.vm.onInput(mockEvent);
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0][0]).toBeNaN();
  });

  it("sets the value of the input as number when the input loses focus", async () => {
    const getParsedValueSpy = vi.spyOn(wrapper.vm, "getParsedValue");
    const input = wrapper.find("input");
    input.element.value = "1.5";
    await input.trigger("input");
    await input.trigger("blur");
    expect(getParsedValueSpy).toHaveNthReturnedWith(2, 1.5);
    expect(wrapper.vm.localValue).toBe(1.5);
  });

  describe("changeValue", () => {
    it("increments value by the specified amount when valid", () => {
      expect(wrapper.vm.getParsedValue()).toBe(10);
      wrapper.vm.changeValue(5);
      expect(wrapper.vm.getParsedValue()).toBe(15);
    });

    it("decrements value by the specified amount when valid", () => {
      expect(wrapper.vm.getParsedValue()).toBe(10);
      wrapper.vm.changeValue(-2);
      expect(wrapper.vm.getParsedValue()).toBe(8);
    });

    it("respects step size for double precision", async () => {
      await wrapper.setProps({ modelValue: 10.5, type: "double" });
      wrapper.vm.changeValue(0.1);
      expect(wrapper.vm.getParsedValue()).toBe(10.6);
    });

    it("handles large step sizes correctly (100)", async () => {
      await wrapper.setProps({ modelValue: 0, max: 1000 });
      wrapper.vm.changeValue(100);
      expect(wrapper.vm.getParsedValue()).toBe(100);
      wrapper.vm.changeValue(100);
      expect(wrapper.vm.getParsedValue()).toBe(200);
      wrapper.vm.changeValue(-100);
      expect(wrapper.vm.getParsedValue()).toBe(100);
    });

    it("handles very small step sizes correctly (0.001)", async () => {
      await wrapper.setProps({ modelValue: 1.0, type: "double" });
      wrapper.vm.changeValue(0.001);
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(1.001, 3);
      wrapper.vm.changeValue(0.001);
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(1.002, 3);
      wrapper.vm.changeValue(-0.001);
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(1.001, 3);
    });

    it("snaps to nearest step (double)", async () => {
      await wrapper.setProps({ modelValue: 1.001, type: "double" });
      wrapper.vm.changeValue(0.01);
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(1.01, 3);
    });

    it("snaps to nearest step (integer)", async () => {
      await wrapper.setProps({ modelValue: 123, max: 1000, type: "integer" });
      wrapper.vm.changeValue(100);
      expect(wrapper.vm.getParsedValue()).toBe(200);

      await wrapper.setProps({ modelValue: 10, type: "integer" });
      wrapper.vm.changeValue(-3);
      expect(wrapper.vm.getParsedValue()).toBe(6);
    });

    it("handles multiple small increments without floating point errors", async () => {
      await wrapper.setProps({ modelValue: 0, type: "double" });
      // Add 0.1 ten times
      for (let i = 0; i < 10; i++) {
        wrapper.vm.changeValue(0.1);
      }
      // Should be 1.0, not 0.9999999999999999 or similar
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(1.0, 1);
    });

    it("emits update:modelValue event when value changes", () => {
      wrapper.vm.changeValue(1);
      expect(wrapper.emitted("update:modelValue")).toBeTruthy();
      expect(wrapper.emitted("update:modelValue").at(-1)[0]).toBe(11);
    });

    it("rounds values to avoid floating point precision issues", () => {
      wrapper.vm.changeValue(0.1);
      wrapper.vm.changeValue(0.1);
      wrapper.vm.changeValue(0.1);
      // Should be 10.3, not 10.300000000000001
      expect(wrapper.vm.getParsedValue()).toBeCloseTo(10.3, 1);
    });

    it("uses findNearestValidValue when current value is invalid", async () => {
      const findNearestValidValueSpy = vi.spyOn(
        wrapper.vm,
        "findNearestValidValue",
      );
      await wrapper.setProps({ modelValue: -5 }); // Below min (0)
      wrapper.vm.changeValue(1);
      expect(findNearestValidValueSpy).toHaveBeenCalledWith(-5);
    });

    it("does not change value when increment would exceed max", async () => {
      await wrapper.setProps({ modelValue: 19, max: 20 });
      wrapper.vm.changeValue(5); // Would make it 24, which is > max
      expect(wrapper.vm.getParsedValue()).toBe(19); // Should stay at 19
    });

    it("does not change value when decrement would go below min", async () => {
      await wrapper.setProps({ modelValue: 1, min: 0 });
      wrapper.vm.changeValue(-5); // Would make it -4, which is < min
      expect(wrapper.vm.getParsedValue()).toBe(1); // Should stay at 1
    });

    it("changes to nearest valid value when currently invalid and incrementing in valid direction", async () => {
      await wrapper.setProps({ modelValue: -5, min: 0 }); // Invalid: below min
      wrapper.vm.changeValue(1); // Increment towards valid range
      expect(wrapper.vm.getParsedValue()).toBe(1); // Should jump to min (0) + increment (1)
    });

    it("changes to nearest valid value when currently invalid and decrementing in valid direction", async () => {
      await wrapper.setProps({ modelValue: 25, max: 20 }); // Invalid: above max
      wrapper.vm.changeValue(-1); // Decrement towards valid range
      expect(wrapper.vm.getParsedValue()).toBe(19); // Should jump to max (20) + increment (-1)
    });

    it("gracefully handles an interval of 0", () => {
      expect(wrapper.vm.getParsedValue()).toBe(10);
      wrapper.vm.changeValue(0);
      expect(wrapper.vm.getParsedValue()).toBe(10);
    });
  });
});
