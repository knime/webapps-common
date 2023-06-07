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
  });

  it("renders big class if prop set", () => {
    const wrapper = shallowMount(Label, {
      props: {
        big: true,
      },
    });
    expect(wrapper.find("label").classes()).toContain("big");
  });

  it("renders big class if bigLabels is provided by a parent component", () => {
    const wrapper = shallowMount(Label, {
      global: {
        provide: {
          bigLabels: true,
        },
      },
    });
    expect(wrapper.find("label").classes()).toContain("big");
  });
});
