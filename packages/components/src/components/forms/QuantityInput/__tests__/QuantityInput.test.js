import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";

import FunctionButton from "../../../Buttons/FunctionButton.vue";
import QuantityInput from "../QuantityInput.vue";

describe("QuantityInput.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 20,
      },
    });
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(buttons.length).toBe(2);
    expect(buttons.at(0).attributes("title")).toBe("Decrease");
    expect(buttons.at(1).attributes("title")).toBe("Increase");
    expect(buttons.at(0).props("disabled")).toBe(false);
    expect(buttons.at(1).props("disabled")).toBe(false);
  });

  it("renders with minimum modelValue", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 10,
        min: 10,
      },
    });
    wrapper.vm.$refs.numberField.stepUp = vi.fn();
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(buttons.length).toBe(2);
    expect(buttons.at(0).props("disabled")).toBe(true);
  });

  it("renders correctly with a lower than minimum modelValue", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 5,
        min: 10,
      },
    });
    wrapper.vm.$refs.numberField.stepUp = vi.fn();
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(buttons.length).toBe(2);
    expect(buttons.at(0).props("disabled")).toBe(true);
  });

  it("renders with maximum modelValue", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 10,
        max: 10,
      },
    });
    wrapper.vm.$refs.numberField.stepUp = vi.fn();
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(buttons.length).toBe(2);
    expect(buttons.at(1).props("disabled")).toBe(true);
  });

  it("renders correctly with a bigger than maximum modelValue", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 15,
        max: 10,
      },
    });
    wrapper.vm.$refs.numberField.stepUp = vi.fn();
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(buttons.length).toBe(2);
    expect(buttons.at(1).props("disabled")).toBe(true);
  });

  it("handles button clicks", async () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 10,
      },
    });
    const buttons = wrapper.findAllComponents(FunctionButton);
    wrapper.vm.$refs.numberField.stepUp = vi.fn();
    wrapper.vm.$refs.numberField.stepDown = vi.fn();

    // decrease
    buttons.at(0).vm.$emit("click");
    await nextTick();
    expect(wrapper.vm.$refs.numberField.stepDown).toHaveBeenCalled();

    // increase
    buttons.at(1).vm.$emit("click");
    await nextTick();
    expect(wrapper.vm.$refs.numberField.stepUp).toHaveBeenCalled();
  });

  it("can be disabled", () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 10,
        disabled: true,
      },
    });
    const buttons = wrapper.findAllComponents(FunctionButton);
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
    expect(buttons.at(1).props("disabled")).toBe(true);
    expect(buttons.at(1).props("disabled")).toBe(true);
  });

  it("sets modelValue to the minimum or maximum on input", async () => {
    const wrapper = shallowMount(QuantityInput, {
      props: {
        modelValue: 20,
        max: 30,
        min: 10,
      },
    });
    const input = wrapper.find("input");

    await input.setValue(99);
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([30]);

    await input.setValue(2);
    expect(wrapper.emitted("update:modelValue")[1]).toEqual([10]);
  });
});
