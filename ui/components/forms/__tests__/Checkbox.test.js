import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Checkbox from "../Checkbox.vue";

describe("Checkbox.vue", () => {
  it("renders", () => {
    const wrapper = mount(Checkbox, {
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
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
      },
    });
    expect(wrapper.find("input").element.checked).toBe(true);
    expect(wrapper.vm.isChecked()).toBe(true);
  });

  it("emits input events", () => {
    const wrapper = mount(Checkbox, {
      props: {
        modelValue: true,
      },
    });
    wrapper.vm.onInput({ target: false });
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });
});
