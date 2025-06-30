import { describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { shallowMount } from "@vue/test-utils";

import Carousel from "../Carousel.vue";

describe("Carousel", () => {
  it("renders default", () => {
    const wrapper = shallowMount(Carousel);

    expect(wrapper.find(".shadow-wrapper").exists()).toBe(true);
    expect(wrapper.find(".carousel").exists()).toBe(true);
  });

  it("renders slot", () => {
    const wrapper = shallowMount(Carousel, {
      slots: {
        default: '<div class="slot"></div>',
      },
    });
    expect(wrapper.find(".slot").exists()).toBe(true);
  });

  it("calls scroll methods", async () => {
    const dragStartSpy = vi.spyOn(Carousel.methods, "onDragStart");
    const mouseLeaveSpy = vi.spyOn(Carousel.methods, "onMouseEnd");
    const mouseDownSpy = vi.spyOn(Carousel.methods, "onMouseDown");
    const mouseMoveSpy = vi.spyOn(Carousel.methods, "onMouseMove");
    const clickSpy = vi.spyOn(Carousel.methods, "onMouseEnd");

    const wrapper = shallowMount(Carousel);

    wrapper.find(".carousel").trigger("dragstart");
    expect(dragStartSpy).toHaveBeenCalled();

    wrapper.find(".carousel").trigger("mousedown", {
      pageX: 0,
    });
    expect(mouseDownSpy).toHaveBeenCalled();

    const scrollValue = 30;

    const event = new Event("mousemove");
    event.pageX = -scrollValue;

    wrapper.find(".carousel").element.dispatchEvent(event);
    await nextTick();
    expect(wrapper.vm.$refs.carousel.scrollLeft).toBe(scrollValue);
    expect(mouseMoveSpy).toHaveBeenCalled();

    wrapper.find(".carousel").trigger("mouseleave");
    expect(mouseLeaveSpy).toHaveBeenCalled();

    wrapper.find(".carousel").trigger("click");
    expect(clickSpy).toHaveBeenCalledTimes(2);
  });
});
