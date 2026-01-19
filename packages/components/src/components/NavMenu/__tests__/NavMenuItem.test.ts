/* eslint-disable vue/one-component-per-file */
import { describe, expect, it, vi } from "vitest";
import { defineComponent, h, inject, nextTick } from "vue";
import { VueWrapper, mount } from "@vue/test-utils";

import NavMenuItem from "../NavMenuItem.vue";
import { ChildItemKey, ListDepthKey, ParentItemKey } from "../keys";
import type { NavMenuItemProps } from "../types";

describe("NavMenuItem.vue", () => {
  const defaultProps: NavMenuItemProps = {
    text: "Item 1",
  };

  type MountOptions = {
    props?: Partial<NavMenuItemProps>;
    slots?: any;
    provideConfig?: Record<any, any>;
  };

  const doMount = (opts: MountOptions = {}) => {
    const LinkComponent = defineComponent({
      props: {
        href: { type: String, required: true },
      },
      setup(fallbackProps, { slots }) {
        const navigate = vi.fn();

        const slotProps = {
          href: fallbackProps.href,
          navigate,
        };

        return () => {
          return slots.default?.(slotProps) ?? null;
        };
      },
    });

    const wrapper = mount(NavMenuItem, {
      props: { ...defaultProps, ...opts.props },
      slots: opts.slots,
      global: {
        provide: {
          NavMenuItemLinkComponent: LinkComponent,
          ...opts.provideConfig,
        },
      },
    });

    return { wrapper };
  };

  it("should render text content", () => {
    const { wrapper } = doMount();

    expect(wrapper.text()).toMatch("Item 1");
  });

  it.each([["append" as const], ["prepend" as const]])(
    "should render %s slot",
    (name) => {
      const { wrapper } = doMount({
        slots: {
          [name]: {
            template: `<div id='${name}' />`,
          },
        },
      });

      expect(wrapper.find(`#${name}`).exists()).toBe(true);
    },
  );

  describe("active state", () => {
    const getClasses = (wrapper: VueWrapper<any>) =>
      wrapper.find(".menu-item").classes();

    it("reports active state to parent", async () => {
      const reportActive = vi.fn();
      const { wrapper } = doMount({
        props: { active: false },
        provideConfig: {
          // top-level item
          [ListDepthKey]: 1,
          [ChildItemKey]: { reportActive },
        },
      });

      expect(reportActive).toHaveBeenCalledExactlyOnceWith(
        expect.anything(),
        false,
      );
      expect(getClasses(wrapper)).not.toContain("prominent-text");
      expect(getClasses(wrapper)).not.toContain("highlighted");
      expect(getClasses(wrapper)).not.toContain("with-indicator");

      await wrapper.setProps({ active: true });

      expect(reportActive).toHaveBeenLastCalledWith(expect.anything(), true);
      expect(getClasses(wrapper)).toContain("prominent-text");
      expect(getClasses(wrapper)).toContain("highlighted");
      expect(getClasses(wrapper)).toContain("with-indicator");
    });

    it("active state as a parent of an active descendant", async () => {
      const DummyChild = defineComponent({
        name: "DummyChild",
        setup() {
          const injected = inject(ParentItemKey);

          injected?.setHasActiveChild(true);

          return () => h("div", { "data-test": "injected" }, injected);
        },
      });

      const reportActive = vi.fn();
      const { wrapper } = doMount({
        props: { active: true },
        provideConfig: {
          // top-level item
          [ListDepthKey]: 1,
          [ChildItemKey]: { reportActive },
        },
        slots: {
          children: () => h(DummyChild),
        },
      });

      await nextTick();

      expect(getClasses(wrapper)).toContain("prominent-text");
      expect(getClasses(wrapper)).not.toContain("highlighted");
      expect(getClasses(wrapper)).toContain("with-indicator");
    });

    it("active state as a nested child", () => {
      const { wrapper } = doMount({
        props: { active: true },
        provideConfig: {
          // nested-level item
          [ListDepthKey]: 2,
        },
      });

      expect(getClasses(wrapper)).toContain("prominent-text");
      expect(getClasses(wrapper)).toContain("highlighted");
      expect(getClasses(wrapper)).not.toContain("with-indicator");
    });
  });

  it("should handle manual navigation", async () => {
    const { wrapper } = doMount({ props: { manualNavigation: true } });

    const preventDefault = vi.fn();

    await wrapper.find("a").trigger("click", { preventDefault });

    expect(preventDefault).toHaveBeenCalled();
    expect(wrapper.emitted("click")).toBeDefined();
  });

  it("should handle href", async () => {
    const { wrapper } = doMount({
      props: { href: "http://www.google.com" },
    });

    const preventDefault = vi.fn();
    expect(wrapper.find("a").attributes("href")).toBe("http://www.google.com");
    await wrapper.find("a").trigger("click", { preventDefault });

    expect(preventDefault).not.toHaveBeenCalled();
  });
});
