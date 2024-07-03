import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import ToggleSwitch from "../ToggleSwitch.vue";

describe("ToggleSwitch.vue", () => {
  it("renders", () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        modelValue: false,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find("label").exists()).toBeTruthy();
    expect(wrapper.find("input").element.checked).toBe(false);
  });

  it("renders checked state", () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        modelValue: true,
      },
    });
    expect(wrapper.find("input").element.checked).toBe(true);
    expect(wrapper.vm.isChecked()).toBe(true);
  });

  it("emits input events", async () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        modelValue: true,
      },
    });
    await wrapper.vm.onChange({ target: false });
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});
