import { describe, it, expect, vi } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";

import FunctionButton from "../FunctionButton.vue";
import BaseButton from "../../base/Button/BaseButton.vue";

describe("FunctionButton.vue", () => {
  it("renders a FunctionButton", () => {
    const wrapper = shallowMount(FunctionButton, {
      slots: {
        default: ["<svg/>", "<span>text</span>"],
      },
    });
    expect(wrapper.findComponent(BaseButton).exists()).toBeTruthy();
    expect(wrapper.classes()).toEqual(["function-button"]);
  });

  it("forwards props", () => {
    const wrapper = shallowMount(FunctionButton, {
      props: {
        to: "test-to",
        href: "test-to",
      },
      slots: {
        default: ["<svg/>", "<span>text</span>"],
      },
    });
    expect(wrapper.findComponent(BaseButton).props("to")).toBe("test-to");
    expect(wrapper.findComponent(BaseButton).props("href")).toBe("test-to");
  });

  it("renders active class", () => {
    const wrapper = shallowMount(FunctionButton, {
      props: {
        active: true,
      },
      slots: {
        default: ["<span>text</span>", "<svg/>"],
      },
    });
    expect(wrapper.classes()).toContain("active");
  });

  it("renders single class if it only has one slot child", () => {
    const wrapper = shallowMount(FunctionButton, {
      slots: {
        default: ["<svg/>"],
      },
    });
    expect(wrapper.classes()).toContain("single");
  });

  it("does not render single class if it has multiple direct slot children", () => {
    const wrapper = shallowMount(FunctionButton, {
      slots: {
        default: ["<svg/>", "<div/>"],
      },
    });
    expect(wrapper.classes()).not.toContain("single");
  });

  it("passes-through event listeners to BaseButton", () => {
    const wrapper = shallowMount(FunctionButton, {
      slots: {
        default: ["<span>text</span>"],
      },
      attrs: {
        onfakeevent: vi.fn(),
      },
    });
    expect(
      wrapper.findComponent(BaseButton).attributes("onfakeevent"),
    ).toBeDefined();
  });

  it("gets focused when focus method is called", () => {
    const wrapper = mount(FunctionButton, {
      slots: {
        default: ["<span>text</span>"],
      },
      attachTo: document.body,
    });
    wrapper.vm.focus();
    expect(document.activeElement).toBe(wrapper.get("button").wrapperElement);
  });

  it("gets button component with getComponent", () => {
    const slot = "<span>text</span>";
    const wrapper = mount(FunctionButton, {
      slots: {
        default: [slot],
      },
      attachTo: document.body,
    });
    const comp = wrapper.vm.getComponent();
    expect(comp.tagName).toBe("BUTTON");
    expect(comp.innerHTML).toBe(slot);
  });

  it("renders disabled button", () => {
    const wrapper = shallowMount(FunctionButton, {
      props: {
        disabled: true,
      },
      slots: {
        default: ["<span>text</span>"],
      },
    });
    expect(wrapper.classes()).toContain("disabled");
  });
});
