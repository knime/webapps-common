import { VueWrapper, mount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
// @ts-ignore
import { createPopper } from "@popperjs/core/dist/esm";
import PopperTestComponent from "./PopperTestComponent.vue";
import type { Options } from "@popperjs/core";

const createPopperResult = {
  destroy: vi.fn(),
  update: vi.fn().mockResolvedValue({}),
};

vi.mock("@popperjs/core/dist/esm", () => ({
  createPopper: vi.fn(() => createPopperResult),
}));

describe("usePopper", () => {
  let props: { options: Partial<Options> };

  beforeEach(() => {
    props = {
      options: { placement: "top" },
    };
  });

  it("creates a popper", () => {
    const wrapper = mount(PopperTestComponent, { props }) as VueWrapper<any>;
    const [targetEl, popperTarget, options] = createPopper.mock.calls[0];
    expect(targetEl).toStrictEqual(wrapper.find("#toggle").element);
    expect(popperTarget).toStrictEqual(wrapper.find("#popover").element);
    expect(options).toStrictEqual(props.options);
    expect(wrapper.vm.popperInstance).not.toBeNull();
  });

  const clearMock = (mock: Mock) => {
    mock.mockClear();
    expect(mock).not.toHaveBeenCalled();
  };

  it("destroys popper on unmount", () => {
    const wrapper = mount(PopperTestComponent, { props });
    clearMock(createPopperResult.destroy);
    wrapper.unmount();
    expect(createPopperResult.destroy).toHaveBeenCalled();
  });

  it("returns update method", () => {
    const wrapper = mount(PopperTestComponent, { props });
    clearMock(createPopperResult.update);
    wrapper.vm.updatePopper();
    expect(createPopperResult.update).toHaveBeenCalled();
  });
});
