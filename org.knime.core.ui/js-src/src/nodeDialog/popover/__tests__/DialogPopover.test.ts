/* eslint-disable @typescript-eslint/no-unused-vars */
import { FunctionButton, useClickOutside } from "@knime/components";
import { FocusTrap } from "focus-trap-vue";

import { DOMWrapper, mount, VueWrapper } from "@vue/test-utils";
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import flushPromises from "flush-promises";

import DialogPopover from "../DialogPopover.vue";
import type DialogPopoverProps from "../types/DialogPopoverProps";

import { unref } from "vue";

const useClickOutsideMock = useClickOutside as Mock<any[], any>;

vi.mock("@knime/components", async (importOriginal) => {
  const actual = (await importOriginal()) as object;
  return {
    ...actual,
    useClickOutside: vi.fn(),
  };
});

const observe = vi.fn();
const unobserve = vi.fn();

describe("DescriptionPopover.vue", () => {
  let props: DialogPopoverProps;

  beforeEach(() => {
    props = {
      tooltip: "tooltip",
      popoverWidth: "max-content",
    };
  });

  window.ResizeObserver = vi.fn(() => ({
    observe,
    unobserve,
    disconnect: vi.fn(),
  }));

  afterEach(() => {
    vi.clearAllMocks();
  });

  const popoverContent = "popover";

  const mountDescriptionPopover = ({
    props,
    popoverElement,
    dialogPopoverTeleportDest,
  }: {
    props: DialogPopoverProps;
    popoverElement?: string;
    dialogPopoverTeleportDest?: HTMLElement;
  }): VueWrapper<any> => {
    return mount(DialogPopover as any, {
      props,
      slots: {
        icon: JSON.stringify,
        popover: popoverElement ?? `<div>${popoverContent}</div>`,
      },
      attachTo: document.body,
      global: {
        provide: {
          getDialogPopoverTeleportDest: () => dialogPopoverTeleportDest,
        },
      },
    });
  };

  const getExposedProps = (
    wrapper: VueWrapper,
  ): { expanded: boolean; focused: boolean } => {
    return JSON.parse(
      wrapper.findComponent(FunctionButton).find("button").text(),
    );
  };

  const togglePopoverExpanded = (wrapper: VueWrapper) => {
    return wrapper.find(".function-button").trigger("mouseup");
  };

  it("renders", () => {
    const wrapper = mountDescriptionPopover({ props });

    // Components
    expect(wrapper.findComponent(FunctionButton).exists()).toBeTruthy();
    expect(getExposedProps(wrapper)).toStrictEqual({
      expanded: false,
      focused: false,
    });
    expect(wrapper.find(".floating").exists()).toBeFalsy();
  });

  it("exposes 'focused' prop", async () => {
    const wrapper = mountDescriptionPopover({ props });

    await wrapper.findComponent(FunctionButton).vm.$emit("focus");

    expect(getExposedProps(wrapper).focused).toBe(true);

    await wrapper.findComponent(FunctionButton).vm.$emit("blur");

    expect(getExposedProps(wrapper).focused).toBe(false);
  });

  describe("toggle floating element", () => {
    interface CustomMatchers {
      toBeExpanded(): any;
      toBeCollapsed(): any;
    }

    let modifiedExpect: (wrapper: VueWrapper) => CustomMatchers;

    beforeEach(() => {
      expect.extend({
        toBeExpanded(wrapper) {
          if (!getExposedProps(wrapper).expanded) {
            return {
              pass: false,
              message: () => "The exposed 'expanded' prop is not set to true.",
            };
          }
          return {
            pass: wrapper.find(".floating").exists(),
            message: () => "The floating element is not present.",
          };
        },
        toBeCollapsed(wrapper) {
          if (getExposedProps(wrapper).expanded) {
            return {
              pass: false,
              message: () => "The exposed 'expanded' prop is not set to false.",
            };
          }
          return {
            pass: !wrapper.find(".floating").exists(),
            message: () =>
              "The floating element is still present but should be collapsed.",
          };
        },
      });
      modifiedExpect = expect as any;
    });

    it("displays floating element on mousup", async () => {
      const wrapper = mountDescriptionPopover({ props });

      await wrapper.find(".function-button").trigger("mouseup");

      modifiedExpect(wrapper).toBeExpanded();
    });

    it("displays floating element on keydown.space", async () => {
      const wrapper = mountDescriptionPopover({ props });

      await wrapper.find(".function-button").trigger("keydown.space");

      modifiedExpect(wrapper).toBeExpanded();

      await wrapper.find(".function-button").trigger("keydown.space");

      modifiedExpect(wrapper).toBeCollapsed();
    });

    it("displays floating element on keydown.enter", async () => {
      const wrapper = mountDescriptionPopover({ props });

      await wrapper.find(".function-button").trigger("keydown.enter");

      modifiedExpect(wrapper).toBeExpanded();

      await wrapper.find(".function-button").trigger("keydown.enter");

      modifiedExpect(wrapper).toBeCollapsed();
    });

    it("closes floating element on escape on button", async () => {
      const wrapper = mountDescriptionPopover({ props });
      await togglePopoverExpanded(wrapper);

      modifiedExpect(wrapper).toBeExpanded();

      const preventDefault = vi.fn();
      const stopPropagation = vi.fn();
      await wrapper
        .find(".function-button")
        .trigger("keydown.esc", { preventDefault, stopPropagation });

      modifiedExpect(wrapper).toBeCollapsed();
      expect(preventDefault).toHaveBeenCalled();
      expect(stopPropagation).toHaveBeenCalled();
      expect(document.activeElement).toBe(wrapper.vm.referenceEl);
    });

    it("closes floating element on escape inside floating element", async () => {
      const wrapper = mountDescriptionPopover({ props });
      await togglePopoverExpanded(wrapper);

      modifiedExpect(wrapper).toBeExpanded();

      await wrapper.find(".floating").trigger("keydown.esc");

      modifiedExpect(wrapper).toBeCollapsed();
      expect(document.activeElement).toBe(wrapper.vm.referenceEl);
    });

    describe("useClickOutside", () => {
      const getComposableParameters = (): Parameters<
        typeof useClickOutside
      > => {
        // @ts-ignore
        return useClickOutside.mock.calls[0];
      };

      beforeEach(() => {
        useClickOutsideMock.mockReset();
      });

      it("uses click outside with empty targets initially", () => {
        mountDescriptionPopover({ props });
        const [{ targets }] = getComposableParameters();
        expect(targets.length).toBe(2);
        expect(unref(targets[0])).toBeNull();
        expect(unref(targets[1])).toBeNull();
      });

      it("sets popover as ignored target", async () => {
        const wrapper = mountDescriptionPopover({ props });
        await togglePopoverExpanded(wrapper);

        const [{ targets }] = getComposableParameters();
        expect(targets.length).toBe(2);
        expect(unref(targets[0])).toBe(wrapper.find(".floating").element);
        expect(unref(targets[1])).toBeNull();
      });

      it("sets another ignored target per prop", () => {
        const anotherElement = document.createElement("input");
        props.ignoredClickOutsideTarget = anotherElement;
        mountDescriptionPopover({ props });

        const [{ targets }] = getComposableParameters();
        expect(targets.length).toBe(2);
        expect(unref(targets[0])).toBeNull();
        expect(unref(targets[1])).toBe(anotherElement);
      });

      it("collapses the floating element on click outside", async () => {
        const wrapper = mountDescriptionPopover({ props });
        await togglePopoverExpanded(wrapper);

        const [{ callback }] = getComposableParameters();

        modifiedExpect(wrapper).toBeExpanded();

        callback({} as PointerEvent);
        await flushPromises();

        modifiedExpect(wrapper).toBeCollapsed();
      });

      it("does not collapse the floating element on click outside when the button is focused", async () => {
        const wrapper = mountDescriptionPopover({ props });
        await togglePopoverExpanded(wrapper);
        wrapper.findComponent(FunctionButton).find("button").element.focus();

        const [{ callback }] = getComposableParameters();

        modifiedExpect(wrapper).toBeExpanded();

        callback({} as PointerEvent);
        await flushPromises();

        modifiedExpect(wrapper).toBeExpanded();
      });

      it("sets click away active iff expanded", async () => {
        const wrapper = mountDescriptionPopover({ props });
        const [_, active] = getComposableParameters();

        expect(unref(active)).toBeFalsy();
        await togglePopoverExpanded(wrapper);
        expect(unref(active)).toBeTruthy();
      });
    });

    it("observes and unobserves resize events on the parentEl when toggling expanded", async () => {
      const dialogPopoverTeleportDest = document.createElement("div");
      dialogPopoverTeleportDest.id = "dialogTeleportTestID";
      const wrapper = mountDescriptionPopover({
        props,
        dialogPopoverTeleportDest,
      });
      await wrapper.find(".function-button").trigger("keydown.space");
      expect(observe).toHaveBeenLastCalledWith(dialogPopoverTeleportDest);

      await wrapper.find(".function-button").trigger("keydown.space");
      expect(unobserve).toHaveBeenCalledWith(dialogPopoverTeleportDest);
    });
  });

  describe("floating element", () => {
    let wrapper: VueWrapper, floatingElement: DOMWrapper<HTMLElement>;

    beforeEach(async () => {
      wrapper = mountDescriptionPopover({ props });
      await togglePopoverExpanded(wrapper);
      floatingElement = wrapper.find(".floating");
    });

    it("consists of an arrow and a box inside a FocusTrap containing the popover", () => {
      expect(floatingElement.findComponent(FocusTrap).find(".box").text()).toBe(
        popoverContent,
      );
      expect(floatingElement.find(".arrow").exists()).toBeTruthy();
    });

    it("is positioned using floating-ui", () => {
      expect(floatingElement.element.style.left).toBe("0px");
      expect(floatingElement.element.style.top).toBe("0px");
      const arrowEl = floatingElement.find(".arrow").element as HTMLElement;
      expect(arrowEl.style.bottom).toBe("-4px");
    });

    describe("focus trap", () => {
      it("focus trap is deactivated per default", () => {
        expect(floatingElement.findComponent(FocusTrap).vm.active).toBeFalsy();
      });

      vi.mock("tabbable", () => ({
        tabbable(containerNode: HTMLElement) {
          return { at: () => containerNode.querySelectorAll("[tabindex]")[0] };
        },
      }));

      it("focus trap is activated on expansion if there exists a tabbable element", async () => {
        vi.useFakeTimers();
        const popoverElement = '<div :tabindex="0">focus me</div>';
        const wrapper = mountDescriptionPopover({ props, popoverElement });
        await togglePopoverExpanded(wrapper);
        const activateSpy = vi.spyOn(
          wrapper.find(".floating").findComponent(FocusTrap).vm,
          "activate",
        );
        vi.runAllTimers();
        expect(activateSpy).toHaveBeenCalled();
        expect(document.activeElement?.innerHTML).toBe("focus me");
      });
    });
  });

  describe("teleportation of popover", () => {
    it("does not teleport the popover in case the inject of dialogPopoverTeleportDest is undefined", async () => {
      const wrapper = mountDescriptionPopover({ props });
      await wrapper.find(".function-button").trigger("mouseup");
      expect(wrapper.find(".floating").exists()).toBeTruthy();
    });

    it("does teleport the popover to the injected element", async () => {
      const dialogPopoverTeleportDest = document.createElement("div");
      const wrapper = mountDescriptionPopover({
        props,
        dialogPopoverTeleportDest,
      });
      await wrapper.find(".function-button").trigger("mouseup");
      expect(wrapper.find(".floating").exists()).toBeFalsy();
      expect(
        (dialogPopoverTeleportDest.firstChild as HTMLElement).className,
      ).toBe("floating");
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
