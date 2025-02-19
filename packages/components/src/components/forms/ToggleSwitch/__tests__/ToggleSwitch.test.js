import { describe, expect, it } from "vitest";
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
    expect(wrapper.find(".checked").exists()).toBeFalsy();
  });

  it("renders checked state", () => {
    const wrapper = mount(ToggleSwitch, {
      props: {
        modelValue: true,
      },
    });
    expect(wrapper.find("input").element.checked).toBe(true);
    expect(wrapper.vm.isChecked()).toBe(true);
    expect(wrapper.find(".checked").exists()).toBeTruthy();
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
