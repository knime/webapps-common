/* eslint-disable @typescript-eslint/no-unused-vars */
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import DialogPopover from "@/nodeDialog/popover/DialogPopover.vue";
import Description from "webapps-common/ui/components/Description.vue";
import DescriptionIcon from "webapps-common/ui/assets/img/icons/circle-help.svg";

import { mount } from "@vue/test-utils";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import DescriptionPopover from "../DescriptionPopover.vue";
import type DescriptionPopoverProps from "../types/DescriptionPopoverProps";

describe("DescriptionPopover.vue", () => {
  let props: DescriptionPopoverProps;

  beforeEach(() => {
    props = {};
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountDescriptionPopover = ({
    props,
  }: {
    props: DescriptionPopoverProps;
  }) => {
    return mount(DescriptionPopover as any, {
      props,
      global: {
        provide: {
          getDialogPopoverTeleportDest: () => null,
        },
      },
    });
  };

  it("renders", () => {
    const wrapper = mountDescriptionPopover({ props });

    // Components
    expect(wrapper.findComponent(DialogPopover).exists()).toBeTruthy();
    expect(wrapper.findComponent(DescriptionIcon).exists()).toBeTruthy();
    expect(wrapper.findComponent(DescriptionIcon).isVisible()).toBeFalsy();
    expect(wrapper.findComponent(Description).exists()).toBeFalsy();

    // Props
    expect(wrapper.findComponent(DialogPopover).props()).toStrictEqual({
      ignoredClickOutsideTarget: null,
      tooltip: "Click for more information",
      popoverWidth: "max-content",
    });
  });

  it("passes down ignoredClickOutsideTarget", () => {
    const someElement = document.createElement("input");
    document.body.appendChild(someElement);
    props.ignoredClickOutsideTarget = someElement;
    const wrapper = mountDescriptionPopover({ props });

    expect(wrapper.findComponent(DialogPopover).props()).toMatchObject({
      ignoredClickOutsideTarget: someElement,
    });
  });

  describe("show description icon", () => {
    it("shows icon on hover", () => {
      props.hover = true;
      const wrapper = mountDescriptionPopover({ props });
      expect(wrapper.findComponent(DescriptionIcon).isVisible()).toBeTruthy();
    });

    it("shows icon on focusin and hides on focusout", async () => {
      const wrapper = mountDescriptionPopover({ props });
      wrapper.findComponent(FunctionButton).vm.$emit("focus");
      await flushPromises();
      expect(wrapper.findComponent(DescriptionIcon).isVisible()).toBeTruthy();
      wrapper.findComponent(FunctionButton).vm.$emit("blur");
      await flushPromises();
      expect(wrapper.findComponent(DescriptionIcon).isVisible()).toBeFalsy();
    });

    it("shows icon when expanded", async () => {
      const wrapper = mountDescriptionPopover({ props });
      await wrapper.find(".function-button").trigger("mouseup");
      expect(wrapper.findComponent(DescriptionIcon).isVisible()).toBeTruthy();
    });
  });

  it("opens Description on button click", async () => {
    const wrapper = mountDescriptionPopover({ props });
    await wrapper.find(".function-button").trigger("mouseup");
    const box = wrapper.find(".box");
    const description = box.findComponent(Description);
    expect(description.exists()).toBeTruthy();
    expect(description.props()).toStrictEqual({
      renderAsHtml: true,
      text: null,
    });
  });

  it("sets html content for description", async () => {
    props.html = "<h1>My html content</h1>";
    const wrapper = mountDescriptionPopover({ props });
    await wrapper.find(".function-button").trigger("mouseup");
    const box = wrapper.find(".box");
    const description = box.findComponent(Description);
    expect(description.props()).toMatchObject({
      text: props.html,
    });
  });
});
