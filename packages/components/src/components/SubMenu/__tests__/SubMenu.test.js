import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";
import { nextTick, ref, unref } from "vue";

import MenuItems from "../../base/MenuItem/MenuItems.vue";
import SubMenu from "../SubMenu.vue";
import FunctionButton from "../../Buttons/FunctionButton.vue";
import { useFloating } from "@floating-ui/vue";
import { useClickOutside } from "../../../composables";

const dropdownNavigation = {
  currentIndex: ref(1),
  resetNavigation: vi.fn(),
  onKeydown: vi.fn(),
};
vi.mock("../../../composables/useDropdownNavigation", () => ({
  default: vi.fn(() => dropdownNavigation),
}));

const floating = {
  update: vi.fn(),
};
vi.mock("@floating-ui/vue", () => ({
  useFloating: vi.fn(() => floating),
  autoUpdate: vi.fn(),
  shift: vi.fn(),
  flip: vi.fn(),
}));
vi.mock("../../../composables/useClickOutside", () => ({ default: vi.fn() }));

describe("SubMenu.vue", () => {
  let props;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    props = {
      id: "testfoobar543",
      items: [
        {
          href: "https://www.google.com/slash",
          text: "Google Slash",
          randomProp: "test",
        },
        {
          href: "https://www.link.me.in",
          text: "Linked Thing",
          anotherProp: "foo",
        },
      ],
    };
  });

  it("renders the menu toggle", () => {
    const wrapper = shallowMount(SubMenu, {
      slots: {
        default: "<svg />click me please <strong>right there</strong>",
      },
      props: {
        items: [],
        buttonTitle: "test button title",
      },
    });
    expect(
      wrapper.findComponent(FunctionButton).find("svg").exists(),
    ).toBeTruthy();
    expect(wrapper.findComponent(FunctionButton).text()).toContain(
      "click me please right there",
    );
    expect(wrapper.findComponent(FunctionButton).attributes("title")).toBe(
      "test button title",
    );
  });

  it("adds expanded classes to root and toggle button", async () => {
    const wrapper = mount(SubMenu, { props });

    expect(wrapper.findComponent(FunctionButton).classes()).not.toContain(
      "expanded",
    );
    expect(wrapper.classes()).not.toContain("expanded");

    await wrapper.find(".submenu-toggle").trigger("click"); // open

    expect(wrapper.findComponent(FunctionButton).classes()).toContain(
      "expanded",
    );
    expect(wrapper.classes()).toContain("expanded");
  });

  it("exposes expanded prop in slot", () => {
    const wrapper = shallowMount(SubMenu, {
      slots: {
        default:
          '<template #default="{ expanded }"><div>{{ expanded }}</div></template>',
      },
      props,
    });
    expect(wrapper.findComponent(FunctionButton).text()).toContain("false");
  });

  it("opens and closes menu on click", async () => {
    const wrapper = mount(SubMenu, { props });
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
    await wrapper.find(".submenu-toggle").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
    await wrapper.find(".submenu-toggle").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
  });

  it("closes menu on close event", async () => {
    const wrapper = mount(SubMenu, { props });
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
    await wrapper.find(".submenu-toggle").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
    await wrapper.findComponent(MenuItems).vm.$emit("close");
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
  });

  it("does not close menu on item-click if item is checkbox", async () => {
    const items = [
      {
        checkbox: {
          checked: true,
        },
      },
    ];
    const id = "test";

    const wrapper = mount(SubMenu, {
      props: { items, id },
    });

    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
    await wrapper.find(".submenu-toggle").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
    wrapper.find(".submenu").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
  });

  it("does not toggle the menu if disabled", async () => {
    props.disabled = true;
    const wrapper = mount(SubMenu, { props });
    await wrapper.find(".submenu-toggle").trigger("click");
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
  });

  it("emits item-click", async () => {
    const wrapper = mount(SubMenu, { props });
    await wrapper.find(".submenu-toggle").trigger("click");

    // assumes MenuItems use <li>
    await wrapper.findComponent(MenuItems).findAll("li")[0].trigger("click");
    let event = wrapper.emitted("item-click")[0];
    expect(typeof event[0]).toBe("object"); // event object
    expect(event[1]).toEqual(props.items[0]);
    expect(event[2]).toEqual(props.id);

    await wrapper.find(".submenu-toggle").trigger("click");
    await wrapper.findComponent(MenuItems).findAll("li")[1].trigger("click");
    event = wrapper.emitted("item-click")[1];
    expect(typeof event[0]).toBe("object"); // event object
    expect(event[1]).toEqual(props.items[1]);
    expect(event[2]).toEqual(props.id);
  });

  it("uses click outside", async () => {
    const wrapper = mount(SubMenu, { props });
    await wrapper.find(".submenu-toggle").trigger("click"); // open
    const [{ targets, callback }, active] = useClickOutside.mock.calls[0];

    expect(unref(targets[0])).toStrictEqual(wrapper.find(".submenu").element);
    expect(unref(targets[1]).$el).toStrictEqual(
      wrapper.findComponent(MenuItems).element,
    );

    expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
    callback();
    await nextTick();
    expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();

    expect(unref(active)).toBe(false);
  });

  it("calls keydown callback", async () => {
    const wrapper = mount(SubMenu, { props });
    await wrapper.find(".submenu-toggle").trigger("click"); // open

    wrapper.find(".submenu").trigger("keydown");

    expect(dropdownNavigation.onKeydown).toHaveBeenCalled();
  });

  it("sets and removes aria-owns and aria-activedescendant on @item-focused", async () => {
    const testId = "testId";
    const wrapper = mount(SubMenu, { props });
    await wrapper.find(".submenu-toggle").trigger("click"); // open

    await wrapper.findComponent(MenuItems).vm.$emit("item-focused", testId);
    expect(wrapper.find(".submenu").attributes("aria-owns")).toBe(testId);
    expect(wrapper.find(".submenu").attributes("aria-activedescendant")).toBe(
      testId,
    );
    await wrapper.findComponent(MenuItems).vm.$emit("item-focused", null);
    expect(wrapper.find(".submenu").attributes("aria-owns")).toBeUndefined();
    expect(
      wrapper.find(".submenu").attributes("aria-activedescendant"),
    ).toBeUndefined();
  });

  describe("popover", () => {
    it("uses floating navigation", () => {
      props.teleportToBody = false; // necessary in order to find the floating ui target in the dom more easily
      const wrapper = mount(SubMenu, { props });
      const [submenu, menuWrapper, options] = useFloating.mock.calls[0];

      expect(unref(submenu)).toStrictEqual(wrapper.find(".submenu").element);
      expect(unref(menuWrapper)).toStrictEqual(
        wrapper.find(".menu-wrapper").element,
      );

      expect(options.placement.value).toBe("bottom-end");
      expect(options.strategy.value).toBe("fixed");
    });

    it("updates floating on toggle", async () => {
      const wrapper = shallowMount(SubMenu, {
        props,
        global: {
          stubs: {
            MenuItems: {
              template: "<div/>",
              methods: {
                resetNavigation: vi.fn(),
              },
            },
          },
        },
      });
      await wrapper.find(".submenu-toggle").trigger("click");
      expect(floating.update).toHaveBeenCalled();
    });
  });

  describe("teleporting to body", () => {
    it("teleports the popover to the body if wanted", async () => {
      const items = [
        {
          href: "https://www.google.com/slash",
          text: "Google Slash",
          randomProp: "test",
        },
        {
          href: "https://www.link.me.in",
          text: "Linked Thing",
          anotherProp: "foo",
        },
      ];
      const id = "testfoobar543";

      const wrapper = mount(SubMenu, {
        props: { items, id },
      });
      await wrapper.find(".submenu-toggle").trigger("click"); // open

      // assumes MenuItems use <li>
      // teleport is enabled by default, so the li cannot be found as it is telported
      expect(wrapper.find("li").exists()).toBeFalsy();
      expect(wrapper.findComponent(MenuItems).find("li").exists()).toBeTruthy();
      await wrapper.setProps({ teleportToBody: false });
      expect(wrapper.find("li").exists()).toBeTruthy();
    });

    it("emits toggle event with calback to collapse the menu on click", async () => {
      const items = [
        {
          href: "https://www.google.com/slash",
          text: "Google Slash",
          randomProp: "test",
        },
        {
          href: "https://www.link.me.in",
          text: "Linked Thing",
          anotherProp: "foo",
        },
      ];
      const id = "testfoobar543";

      const wrapper = mount(SubMenu, {
        props: { items, id },
      });
      // assumes MenuItems use <li>
      await wrapper.find(".submenu-toggle").trigger("click");

      const [event, callback] = wrapper.emitted("toggle")[0];
      expect(event).toBeTruthy();
      expect(typeof callback).toBe("function");
      expect(wrapper.findComponent(MenuItems).exists()).toBeTruthy();
      callback();
      await nextTick();
      expect(wrapper.findComponent(MenuItems).exists()).toBeFalsy();
    });
  });

  it("emits open and close events", async () => {
    const items = [
      {
        href: "https://www.google.com/slash",
        text: "Google Slash",
        randomProp: "test",
      },
      {
        href: "https://www.link.me.in",
        text: "Linked Thing",
        anotherProp: "foo",
      },
    ];
    const id = "testfoobar543";

    const wrapper = mount(SubMenu, {
      props: { items, id },
    });
    // assumes MenuItems use <li>
    await wrapper.find(".submenu-toggle").trigger("click");

    expect(wrapper.emitted("open")).toBeDefined();

    await wrapper.find(".submenu-toggle").trigger("click");

    expect(wrapper.emitted("close")).toBeDefined();
  });
});
