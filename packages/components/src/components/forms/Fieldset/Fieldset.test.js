import { beforeEach, describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Label from "./Fieldset.vue";

describe("Fieldset", () => {
  let props;

  beforeEach(() => {
    props = {
      text: "Testing fieldset",
    };
  });

  it("renders", () => {
    const wrapper = shallowMount(Label, {
      props,
      slots: {
        default: "slot content",
      },
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.get("legend").text()).toContain(props.text);
    expect(wrapper.text()).toContain("slot content");
  });

  it("renders icon slot", () => {
    const wrapper = shallowMount(Label, {
      slots: {
        icon: "icon content",
      },
    });
    expect(wrapper.get("legend").text()).toContain("icon content");
  });

  it("provides largeLabels to child components", () => {
    const wrapper = shallowMount(Label, {
      provide: {
        largeLabels: true,
      },
    });
    expect(wrapper.vm.$options.provide).toEqual({ largeLabels: true });
  });
});
