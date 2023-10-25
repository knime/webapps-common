import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Label from "../Label.vue";

describe("Label.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      text: "Testing Label",
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
    expect(wrapper.text()).toContain(props.text);
    expect(wrapper.text()).toContain("slot content");
    expect(wrapper.emitted("labelForId")[0][0]).toBe(wrapper.vm.labelFor);
  });

  it("renders large class if prop set", () => {
    const wrapper = shallowMount(Label, {
      props: {
        large: true,
      },
    });
    expect(wrapper.find("label").classes()).toContain("large");
  });

  it("renders large class if largeLabels is provided by a parent component", () => {
    const wrapper = shallowMount(Label, {
      global: {
        provide: {
          largeLabels: true,
        },
      },
    });
    expect(wrapper.find("label").classes()).toContain("large");
  });
});
