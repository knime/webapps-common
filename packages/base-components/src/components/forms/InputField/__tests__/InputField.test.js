import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import InputField from "../InputField.vue";

describe("InputField.vue", () => {
  it("renders", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "Test value",
      },
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find(".input-wrapper").exists()).toBeTruthy();
    let input = wrapper.find("input");
    expect(input.attributes("type")).toBe("text"); // default
    expect(input.element.value).toBe("Test value");
  });

  it("renders invalid style", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "Test value",
        isValid: false,
      },
    });
    expect(wrapper.find(".invalid-marker").exists()).toBe(true);
  });

  it("renders with autofocus attribute", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "",
        autofocus: true,
      },
    });
    expect(wrapper.find("input").attributes().autofocus).toBeDefined();
  });

  it("renders with icon slot", () => {
    const wrapper = mount(InputField, {
      slots: {
        icon: "<svg />",
      },
    });
    expect(wrapper.find("input").classes()).toContain("with-icon");
    expect(wrapper.findAll("svg").length).toBe(1);
  });

  it("renders with right-aligned icon slot", () => {
    const wrapper = mount(InputField, {
      slots: {
        iconRight: "<svg />",
      },
    });
    expect(wrapper.find("input").classes()).toContain("with-icon-right");
    expect(wrapper.findAll("svg").length).toBe(1);
  });

  it("renders with both left- and  right-aligned icon slot", () => {
    const wrapper = mount(InputField, {
      slots: {
        icon: "<svg />",
        iconRight: "<svg />",
      },
    });
    expect(wrapper.find("input").classes()).toContain("with-icon");
    expect(wrapper.find("input").classes()).toContain("with-icon-right");
    expect(wrapper.findAll("svg").length).toBe(2);
  });

  it("renders custom type", () => {
    const wrapper = mount(InputField, {
      props: {
        type: "password",
      },
    });
    let input = wrapper.find("input");
    expect(input.attributes("type")).toBe("password");
  });

  it("validates without pattern", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "b",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("invalidates non-matching pattern", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "b",
        pattern: "^a",
      },
    });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "Input does not match the expected pattern",
      isValid: false,
    });
  });

  it("validates unicode", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "Testing «ταБЬℓσ»: 1<2 & 4+1>3, now 20% off!",
        pattern: "[\u0000-\uFFFF]*",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("validates unicode pattern", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: 'te%tString!"$<>',
        pattern: "[\u0000-\u007F]+",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("invalidates wrong unicode pattern", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: 'te%tSætring!"$<>',
        pattern: "[\u0000-\u007F]+",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(false);
  });

  it("validates emojis", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "👌",
        pattern: "\\p{Emoji_Presentation}+",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("validates placeholders", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "2A_% S",
        pattern: "\\d\\D\\w\\W\\s\\S+",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("validates multiple unicode ranges", () => {
    const wrapper = mount(InputField, {
      props: {
        modelValue: "adaሑtest",
        pattern: "([\u1200-\u12BF]|[\u0000-\u007F])*",
      },
    });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("emits input events", () => {
    const wrapper = mount(InputField);
    const newValue = "new value";
    let input = wrapper.find("input");
    input.setValue(newValue);
    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(newValue);
  });

  it.each([["keydown"], ["keypress"], ["keyup"]])(
    "emits %s events",
    (eventName) => {
      const wrapper = mount(InputField);

      const input = wrapper.find("input");
      input.trigger(eventName, { key: "X" });
      expect(wrapper.emitted(eventName)[0][0].key).toBe("X");
    },
  );

  it("focuses on focus call", () => {
    const wrapper = mount(InputField, {
      attachTo: document.body,
    });
    wrapper.vm.focus();
    expect(document.activeElement).toEqual(wrapper.find("input").element);
  });

  it("emits focus event", () => {
    const wrapper = mount(InputField);
    const input = wrapper.find("input");
    input.trigger("focus");
    expect(wrapper.emitted().focus).toBeTruthy();
  });
});
