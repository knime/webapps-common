import { describe, it, expect, beforeAll, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { FocusTrap } from "focus-trap-vue";

import BaseModal from "../BaseModal.vue";

describe("BaseModal", () => {
  describe("rendering", () => {
    beforeAll(() => {
      vi.spyOn(window, "addEventListener");
      vi.spyOn(window, "removeEventListener");
    });

    it("renders default inactive", () => {
      let wrapper = shallowMount(BaseModal, {
        slots: {
          default: "<p>test</p>",
        },
      });
      expect(window.addEventListener).not.toHaveBeenCalled();
      expect(wrapper.findComponent(FocusTrap).exists()).toBeFalsy();
      expect(wrapper.find({ ref: "dialog" }).exists()).toBeFalsy();
    });

    it("activates and deactivates", async () => {
      let wrapper = shallowMount(BaseModal, {
        slots: {
          default: '<p class="content-item">test</p>',
        },
      });

      // only manual activation is supported
      await wrapper.setProps({ active: true });

      // activate
      expect(wrapper.find(".overlay").exists()).toBeTruthy();
      expect(wrapper.find(".content-item").exists()).toBeFalsy();
      expect(wrapper.findComponent(FocusTrap).props("active")).toBeFalsy();

      // show content
      await wrapper.setData({ showContent: true });
      expect(wrapper.find(".content-item").exists()).toBeTruthy();
      expect(wrapper.findComponent(FocusTrap).props("active")).toBeTruthy();
      expect(window.addEventListener).toHaveBeenCalled();

      // hide again
      await wrapper.setProps({ active: false });
      expect(window.removeEventListener).toHaveBeenCalled();
      expect(wrapper.find({ ref: "dialog" }).exists()).toBeFalsy();
      expect(wrapper.findComponent(FocusTrap).exists()).toBeFalsy();
    });
  });

  it("emits cancel event on ESC key", async () => {
    let wrapper = shallowMount(BaseModal);

    // only manual activation is supported
    await wrapper.setProps({ active: true });

    window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("emits cancel event on overlay click", async () => {
    let wrapper = shallowMount(BaseModal);

    // only manual activation is supported
    await wrapper.setProps({ active: true });

    await wrapper.find(".overlay").trigger("click");
    expect(wrapper.emitted().cancel).toBeTruthy();
  });

  it("does not propagate event on overlay click", async () => {
    let wrapper = shallowMount(BaseModal, {
      slots: {
        default: '<p class="content-item">test</p>',
      },
    });

    await wrapper.setProps({ active: true });
    await wrapper.setData({ showContent: true });
    let fakeEvent = { stopPropagation: vi.fn() };

    await wrapper.find({ ref: "dialog" }).trigger("click", fakeEvent);
    expect(fakeEvent.stopPropagation).toHaveBeenCalled();
  });
});
