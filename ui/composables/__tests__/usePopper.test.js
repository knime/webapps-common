import { mount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createPopper } from "@popperjs/core/dist/esm";
import PopperTestComponent from "./PopperTestComponent.vue";

const createPopperResult = {
  destroy: vi.fn(),
  update: vi.fn().mockResolvedValue(),
};

vi.mock("@popperjs/core/dist/esm", () => ({
  createPopper: vi.fn(() => createPopperResult),
}));

describe("usePopper", () => {
  let props;

  beforeEach(() => {
    props = {
      options: { test: "foo" },
    };
  });

  it("creates a popper", () => {
    const wrapper = mount(PopperTestComponent, { props });
    const [targetEl, popperTarget, options] = createPopper.mock.calls[0];
    expect(targetEl).toStrictEqual(wrapper.find("#toggle").element);
    expect(popperTarget).toStrictEqual(wrapper.find("#popover").element);
    expect(options).toStrictEqual(props.options);
    expect(wrapper.vm.popperInstance).not.toBeNull();
  });

  it("destroys popper on unmount", () => {
    const wrapper = mount(PopperTestComponent, { props });
    createPopperResult.destroy.reset();
    wrapper.unmount();
    expect(createPopperResult.destroy).toHaveBeenCalled();
  });

  it("returns update method", () => {
    const wrapper = mount(PopperTestComponent, { props });
    createPopperResult.update.reset();
    wrapper.vm.updatePopper();
    expect(createPopperResult.update).toHaveBeenCalled();
  });
});
