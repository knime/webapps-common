import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Pill from "../../../Pill/Pill.vue";
import ProgressBar from "../../ProgressBar/ProgressBar.vue";
import type { ProgressItemProps } from "../../types";
import ProgressItem from "../ProgressItem.vue";

describe("ProgressItem.vue", () => {
  const defaultProps: ProgressItemProps = {
    id: "test",
    title: "testfile.txt",
  };

  it("renders correctly with default props", () => {
    const wrapper = mount(ProgressItem, {
      props: defaultProps,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find(".title").text()).toBe("testfile.txt");
    expect(wrapper.find(".subtitle").exists()).toBe(false);
    expect(wrapper.findComponent(Pill).exists()).toBe(false);
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(false);
  });

  it("renders with subtitle", () => {
    const wrapper = mount(ProgressItem, {
      props: { ...defaultProps, subtitle: "subtitle" },
    });

    expect(wrapper.find(".subtitle").text()).toMatch("subtitle");
  });

  it("renders with progress", () => {
    const wrapper = mount(ProgressItem, {
      props: { ...defaultProps, progress: 40 },
    });

    expect(wrapper.findComponent(ProgressBar).exists()).toBe(true);
    expect(wrapper.findComponent(ProgressBar).props("percentage")).toBe(40);
  });

  it("should add padded class when there's no progress", async () => {
    const wrapper = mount(ProgressItem, {
      props: { ...defaultProps },
    });

    expect(wrapper.find(".progress-item").classes()).toContain("padded");

    await wrapper.setProps({ progress: 40 });

    expect(wrapper.find(".progress-item").classes()).not.toContain("padded");
  });

  it("renders with pill", () => {
    const wrapper = mount(ProgressItem, {
      props: {
        ...defaultProps,
        statusPill: { text: "pill text", variant: "success" },
      },
    });

    expect(wrapper.findComponent(Pill).exists()).toBe(true);
    expect(wrapper.findComponent(Pill).props("variant")).toBe("success");
    expect(wrapper.findComponent(Pill).text()).toMatch("pill text");
  });

  it.each([["prepend"] as const, ["actions"] as const])(
    "renders %s slot",
    (slotName) => {
      const wrapper = mount(ProgressItem, {
        props: defaultProps,
        slots: {
          [slotName]: {
            template: `<div id="${slotName}-slot-content"></div>`,
          },
        },
      });

      expect(wrapper.find(`#${slotName}-slot-content`).exists()).toBe(true);
    },
  );
});
