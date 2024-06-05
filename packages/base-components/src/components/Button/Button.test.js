import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Button from "./Button.vue";
import BaseButton from "../base/BaseButton.vue";

describe("Button.vue", () => {
  it("renders a button", () => {
    const wrapper = shallowMount(Button);
    expect(wrapper.findComponent(BaseButton).exists()).toBeTruthy();
    expect(wrapper.classes()).toEqual(["button"]);
  });

  it("forwards props", () => {
    const wrapper = shallowMount(Button, {
      props: {
        preventDefault: true,
        to: "test-to",
        href: "test-href",
      },
    });
    expect(wrapper.findComponent(BaseButton).exists()).toBeTruthy();
    expect(wrapper.findComponent(BaseButton).props("preventDefault")).toBe(
      true,
    );
    expect(wrapper.findComponent(BaseButton).props("to")).toBe("test-to");
    expect(wrapper.findComponent(BaseButton).props("href")).toBe("test-href");
  });

  it("renders classes according to props on dark", () => {
    const wrapper = shallowMount(Button, {
      props: {
        primary: true,
        compact: true,
        withBorder: true,
        onDark: true,
      },
    });
    expect(wrapper.classes().sort()).toEqual(
      ["button", "primary", "compact", "with-border", "on-dark"].sort(),
    );
  });

  it("renders classes according to props with warning", () => {
    const wrapper = shallowMount(Button, {
      props: {
        primary: true,
        compact: true,
        withBorder: true,
        withWarning: true,
      },
    });
    expect(wrapper.classes().sort()).toEqual(
      ["button", "primary", "compact", "with-border", "with-warning"].sort(),
    );
  });

  it("renders disabled state", () => {
    let wrapper = shallowMount(Button, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.attributes("disabled")).toBe("true");
  });

  it("accepts any optional attribute", () => {
    const wrapper = shallowMount(Button, {
      props: {
        href: "testhref",
        id: "testId",
      },
    });
    expect(wrapper.attributes("id")).toBe("testId");
  });
});
