import { describe, expect, it } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";

import DownIcon from "@knime/styles/img/icons/circle-arrow-down.svg";

import Button from "../../Buttons/Button.vue";
import IdleReadyButton from "../IdleReadyButton.vue";

describe("IdleReadyButton.vue", () => {
  it("doesn’t render when not needed", () => {
    let wrapper = shallowMount(IdleReadyButton, {
      props: {
        ready: false,
        idle: false,
      },
    });
    expect(wrapper.find("div").exists()).toBe(false);
  });

  it("handles idle state correctly", async () => {
    let wrapper = shallowMount(IdleReadyButton, {
      props: {
        ready: true,
        idle: true,
      },
    });
    expect(wrapper.text()).toContain("Loading...");
    expect(wrapper.text()).not.toContain("More results");

    // Idle complete
    await wrapper.setProps({ idle: false });
    expect(wrapper.text()).not.toContain("Loading...");
    expect(wrapper.text()).toContain("More results");
  });

  it("accepts button text", async () => {
    let wrapper = shallowMount(IdleReadyButton, {
      props: {
        readyText: "test text",
        idleText: "Idle",
        idle: true,
      },
    });
    expect(wrapper.text()).toContain("Idle");

    // Idle complete
    await wrapper.setProps({ idle: false });
    expect(wrapper.text()).not.toContain("Idle");
    expect(wrapper.text()).toContain("test text");
  });

  it("renders an icon", () => {
    let wrapper = shallowMount(IdleReadyButton, {
      props: {
        withDownIcon: false,
      },
    });
    expect(wrapper.findComponent(DownIcon).exists()).toBeFalsy();

    wrapper = shallowMount(IdleReadyButton, {
      props: {
        withDownIcon: true,
      },
    });
    expect(wrapper.findComponent(DownIcon).exists()).toBeTruthy();
  });

  it("renders border", async () => {
    let wrapper = shallowMount(IdleReadyButton);
    expect(wrapper.findComponent(Button).props("withBorder")).toBeTruthy();

    await wrapper.setProps({
      withBorder: false,
    });
    expect(wrapper.findComponent(Button).props("withBorder")).toBeFalsy();
  });

  it("emits events", () => {
    let wrapper = mount(IdleReadyButton, {
      props: {
        idle: false,
        ready: true,
      },
    });
    wrapper.findComponent(Button).vm.$emit("click");
    expect(wrapper.emitted("click")).toBeDefined();
  });
});
