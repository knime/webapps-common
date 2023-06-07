import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";

import Label from "../Fieldset.vue";

describe("Fieldset.vue", () => {
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
});
