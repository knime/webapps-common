import { describe, expect, it, vi } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";

import PlusIcon from "@knime/styles/img/icons/plus-small.svg";

import Tooltip from "../../Tooltip/Tooltip.vue";
import Button from "../Button.vue";
import PlusButton from "../PlusButton.vue";

describe("PlusButton", () => {
  it("renders plus button", () => {
    const wrapper = shallowMount(PlusButton);

    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();

    expect(wrapper.findComponent(Button).exists()).toBeTruthy();
    expect(wrapper.findComponent(Button).classes()).toEqual(["plus-button"]);
    expect(wrapper.findComponent(PlusIcon).exists()).toBeTruthy();
  });

  it("forwards listeners", () => {
    let wrapper = shallowMount(PlusButton, {
      attrs: {
        onfakeevent: vi.fn(),
      },
    });
    expect(
      wrapper.findComponent(Button).attributes("onfakeevent"),
    ).toBeDefined();
  });

  it("forwards props", () => {
    const wrapper = mount(PlusButton, {
      props: {
        primary: true,
        onDark: true,
      },
    });
    expect(wrapper.findComponent(Button).props("primary")).toBe(true);
    expect(wrapper.findComponent(Button).props("onDark")).toBe(true);
  });

  it("renders disabled state", () => {
    let wrapper = shallowMount(PlusButton, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.findComponent(Button).attributes("disabled")).toBe("true");
  });

  it("renders tooltip", () => {
    const wrapper = shallowMount(PlusButton, {
      props: {
        title: "plus button",
      },
    });
    expect(wrapper.props("title")).toBe("plus button");
    expect(wrapper.findComponent(Tooltip).exists()).toBeTruthy();
  });

  it("does not render tooltip", () => {
    const wrapper = shallowMount(PlusButton);
    expect(wrapper.props("title")).toBeNull();
    expect(wrapper.findComponent(Tooltip).exists()).toBeFalsy();
  });
});
