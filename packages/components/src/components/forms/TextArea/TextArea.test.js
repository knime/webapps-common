import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import TextArea from "./TextArea.vue";

describe("TextArea.vue", () => {
  it("renders", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "Test value",
      },
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    let textArea = wrapper.find("textarea");
    expect(textArea.element.value).toBe("Test value");
  });

  it("renders invalid style", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "Test value",
        isValid: false,
      },
    });
    expect(wrapper.find(".invalid-marker").exists()).toBe(true);
  });

  it("emits input events", () => {
    const wrapper = mount(TextArea);
    const newValue = "new value";
    let textArea = wrapper.find("textarea");
    textArea.setValue(newValue);
    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(newValue);
  });
});
