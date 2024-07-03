/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import { mount } from "@vue/test-utils";
import { describe, it, expect, vi } from "vitest";

import StyledListItem from "./StyledListItem.vue";

vi.useFakeTimers();

describe("StyledListItem.vue", () => {
  it("renders", () => {
    const wrapper = mount(StyledListItem);
    expect(wrapper.find('[role="option"]')).toBeTruthy();
  });

  it("emits events", () => {
    const wrapper = mount(StyledListItem);
    const option = wrapper.find('[role="option"]');
    option.trigger("click");
    expect(wrapper.emitted("click")[0]).toBeDefined();
    option.trigger("dblclick");
    expect(wrapper.emitted("dblclick-exact")[0]).toBeDefined();
    option.trigger("dblclick", { shiftKey: true });
    expect(wrapper.emitted("dblclick-shift")[0]).toBeDefined();
    option.trigger("mousedown");
    expect(wrapper.emitted("mousedown")[0]).toBeDefined();
    option.trigger("mousemove");
    expect(wrapper.emitted("mousemove")[0]).toBeDefined();
  });

  it("trims text", () => {
    const wrapper = mount(StyledListItem, { propsData: { text: "Test   " } });
    const option = wrapper.find('[role="option"]');
    expect(option.text()).toBe("Test");
  });
});
