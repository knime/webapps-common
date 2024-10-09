import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ClickOutsideTestComponent from "./ClickOutsideTestComponent.vue";

describe("useClickOutside", () => {
  let props;

  beforeEach(() => {
    props = {
      callback: vi.fn(),
    };
  });

  const clickOnElementWithId = (wrapper, id, type = "click") => {
    const event = new Event(type, { bubbles: true });
    event.detail = 0; // @vueuse/core 9.13.0 uses this information in order to see that the event is not a mousedown/up event
    const target = wrapper.find(id).element;
    target.dispatchEvent(event);
  };

  it("calls callback on click outside", () => {
    const wrapper = mount(ClickOutsideTestComponent, {
      props,
      attachTo: document.body,
    });
    clickOnElementWithId(wrapper, "#buttonOutside");
    expect(props.callback).toHaveBeenCalled();
    wrapper.unmount();
  });

  it("does not call callback when clicking one of the targets", () => {
    const wrapper = mount(ClickOutsideTestComponent, {
      props,
      attachTo: document.body,
    });
    clickOnElementWithId(wrapper, "#buttonInside");
    expect(props.callback).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it("does not call callback when clicking a subelement of one of the targets", () => {
    const wrapper = mount(ClickOutsideTestComponent, {
      props,
      attachTo: document.body,
    });
    clickOnElementWithId(wrapper, "#nestedButtonInside");
    expect(props.callback).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  describe("active", () => {
    it("does not do anything if inactive", () => {
      props.active = false;
      const wrapper = mount(ClickOutsideTestComponent, {
        props,
        attachTo: document.body,
      });

      clickOnElementWithId(wrapper, "#buttonOutside");

      expect(props.callback).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("reacts to change of active state", async () => {
      const wrapper = mount(ClickOutsideTestComponent, {
        props,
        attachTo: document.body,
      });

      await wrapper.setProps({ active: false });

      clickOnElementWithId(wrapper, "#buttonOutside");
      expect(props.callback).not.toHaveBeenCalled();

      await wrapper.setProps({ active: true });

      clickOnElementWithId(wrapper, "#buttonOutside");
      expect(props.callback).toHaveBeenCalled();
      wrapper.unmount();
    });
  });
});
