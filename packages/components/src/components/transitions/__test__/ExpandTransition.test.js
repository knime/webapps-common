import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import ExpandTransition from "../ExpandTransition.vue";

describe("ExpandTransition.vue", () => {
  it("calls transition handlers and expands", async () => {
    const enterSpy = vi.spyOn(ExpandTransition.methods, "onEnter");
    const leaveSpy = vi.spyOn(ExpandTransition.methods, "onLeave");

    const wrapper = mount(ExpandTransition, {
      propsData: {
        isExpanded: false,
      },
      slots: {
        default:
          "<p class='slotted'>some test content <strong>here</strong></p>",
      },
      attachTo: document.body,
    });

    expect(wrapper.find(".slotted").isVisible()).toBe(false);

    // open
    await wrapper.setProps({ isExpanded: true });

    expect(wrapper.find(".slotted").isVisible()).toBe(true);

    // close
    await wrapper.setProps({ isExpanded: false });
    expect(wrapper.find(".slotted").isVisible()).toBe(false);

    wrapper.unmount();
  });
});
