import { describe, it, expect, vi, beforeEach } from "vitest";
import { defineComponent, ref } from "vue";
import { mount, shallowMount } from "@vue/test-utils";

import MenuItems from "../MenuItems.vue";

import BaseMenuItems from "../BaseMenuItems.vue";

const dropdownNavigation = {
  currentIndex: ref(1),
  resetNavigation: vi.fn(),
  onKeydown: vi.fn(),
};
vi.mock("../../composables/useDropdownNavigation", () => ({
  default: vi.fn(() => dropdownNavigation),
}));
import useDropdownNavigation from "../../composables/useDropdownNavigation";

describe("MenuItems.vue", () => {
  it("passes down all props", () => {
    const myProp = "test property";
    const wrapper = shallowMount(MenuItems, {
      props: { myProp, items: [], menuAriaLabel: "" },
    });
    expect(wrapper.findComponent(BaseMenuItems).vm.$attrs.myProp).toBe(myProp);
  });

  it("passes up item-click event", () => {
    const myProp = "test property";
    const wrapper = shallowMount(MenuItems, {
      props: { myProp, items: [], menuAriaLabel: "" },
    });
    wrapper
      .findComponent(BaseMenuItems)
      .vm.$emit("item-click", "event", "item", "id");
    expect(wrapper.emitted("item-click")[0]).toStrictEqual([
      "event",
      "item",
      "id",
    ]);
  });

  it("passes up item-hovered event", () => {
    const myProp = "test property";
    const wrapper = shallowMount(MenuItems, {
      props: { myProp, items: [], menuAriaLabel: "" },
    });
    wrapper
      .findComponent(BaseMenuItems)
      .vm.$emit("item-hovered", "item", "id", -1);
    expect(wrapper.emitted("item-hovered")[0]).toStrictEqual([
      "item",
      "id",
      -1,
    ]);
  });

  it("passes up item-focused event", () => {
    const myProp = "test property";
    const wrapper = shallowMount(MenuItems, {
      props: { myProp, items: [], menuAriaLabel: "" },
    });
    wrapper.findComponent(BaseMenuItems).vm.$emit("item-focused", "id");
    expect(wrapper.emitted("item-focused")[0]).toStrictEqual(["id"]);
  });

  describe("dropdown navigation", () => {
    it("marks active element", () => {
      const wrapper = shallowMount(MenuItems, {
        props: { items: [], menuAriaLabel: "" },
      });
      const currentfocusedIndex = dropdownNavigation.currentIndex.value;
      expect(wrapper.findComponent(BaseMenuItems).vm.focusedItemIndex).toBe(
        currentfocusedIndex,
      );
    });

    it("uses close function which emits @close", () => {
      useDropdownNavigation.reset();
      const wrapper = shallowMount(MenuItems, {
        props: { items: [], menuAriaLabel: "" },
      });
      const { close } = useDropdownNavigation.mock.calls[0][0];

      close();
      expect(wrapper.emitted("close")[0]).toBeDefined();
    });

    describe("getNextElement", () => {
      const first = { index: 2, element: "Apple", onClick: vi.fn() };
      const second = { index: 4, element: "Ananas", onClick: vi.fn() };
      const third = { index: 10, element: "Banana", onClick: vi.fn() };

      let getNextElement;
      const scrollToMock = vi.fn();

      const getItem = (item) => ({ index: item.index, onClick: item.onClick });

      beforeEach(() => {
        useDropdownNavigation.reset();
        mount(MenuItems, {
          global: {
            stubs: {
              BaseMenuItems: {
                methods: {
                  getEnabledListItems: () => [first, second, third],
                  scrollTo: scrollToMock,
                },
                template: "<div/>",
              },
            },
          },
          props: {
            items: [],
            menuAriaLabel: "",
          },
        });
        getNextElement = useDropdownNavigation.mock.calls[0][0].getNextElement;
      });

      it("yields the first element on downward navigation if there is no previous selection", () => {
        expect(getNextElement(-1, 1)).toEqual(getItem(first));
        expect(getNextElement(0, 1)).toEqual(getItem(first));
      });

      it("yields next element on downwards navigation and wraps around", () => {
        expect(getNextElement(first.index, 1)).toEqual(getItem(second));
        expect(getNextElement(second.index, 1)).toEqual(getItem(third));
        expect(getNextElement(third.index, 1)).toEqual(getItem(first));
      });

      it("yields the last element on upwards navigation if there is no previous selection", () => {
        expect(getNextElement(-1, -1)).toEqual(getItem(third));
        expect(getNextElement(0, -1)).toEqual(getItem(third));
      });

      it("yields next element on upwards navigation and wraps around", () => {
        expect(getNextElement(third.index, -1)).toEqual(getItem(second));
        expect(getNextElement(second.index, -1)).toEqual(getItem(first));
        expect(getNextElement(first.index, -1)).toEqual(getItem(third));
      });

      it("calls scrollTo", () => {
        getNextElement(third.index, -1);
        expect(scrollToMock).toHaveBeenCalledWith(third.element);
      });
    });
  });

  describe("exposed methods", () => {
    let parentWrapper;

    beforeEach(() => {
      const ParentComponent = defineComponent({
        components: { MenuItems },
        template: "<MenuItems ref='menu' :items='[]' menuAriaLabel=''/>",
      });

      parentWrapper = mount(ParentComponent);
    });

    it("exposes onKeydown", () => {
      parentWrapper.vm.$refs.menu.onKeydown({ code: 5 });
      expect(dropdownNavigation.onKeydown).toHaveBeenCalled();
    });

    it("exposes resetNavigation", () => {
      parentWrapper.vm.$refs.menu.resetNavigation();
      expect(dropdownNavigation.resetNavigation).toHaveBeenCalled();
    });
  });

  describe("sub level menus", () => {
    it("renders sub menu", async () => {
      const wrapper = mount(MenuItems, {
        props: {
          menuAriaLabel: "submenu",
          items: [
            {
              text: "Item 1",
              children: [{ text: "sub 1" }, { text: "sub 2" }],
            },
            { text: "Item 2" },
          ],
        },
      });
      // closed on start
      expect(wrapper.findAllComponents(MenuItems).length).toBe(0);
      // indicator visible
      expect(wrapper.find(".sub-menu-indicator").exists()).toBe(true);
      // open on hover
      await wrapper.findAll("li").at(0).trigger("pointerenter");
      expect(wrapper.findAllComponents(MenuItems).length).toBe(1);
      // close on hover of non sub menu (index 3 is next toplevel item: 'Item 2')
      await wrapper.findAll("li").at(3).trigger("pointerenter");
      expect(wrapper.findAllComponents(MenuItems).length).toBe(0);
    });

    it("open/close via keyboard", async () => {
      const wrapper = mount(MenuItems, {
        props: {
          registerKeydown: true,
          menuAriaLabel: "submenu",
          items: [
            {
              text: "Item 1",
              children: [{ text: "sub 1" }, { text: "sub 2" }],
            },
          ],
        },
      });
      expect(wrapper.findAllComponents(MenuItems).length).toBe(0);
      expect(wrapper.find(".sub-menu-indicator").exists()).toBe(true);
      // fake keyboard selection/focus
      dropdownNavigation.currentIndex.value = 0;
      // open
      await wrapper
        .findAll(".list-item")
        .at(0)
        .trigger("keydown", { code: "ArrowRight" });
      expect(wrapper.findAllComponents(MenuItems).length).toBe(1);
      // close
      await wrapper
        .findAll(".list-item")
        .at(0)
        .trigger("keydown", { code: "ArrowLeft" });
      expect(wrapper.findAllComponents(MenuItems).length).toBe(0);
    });
  });
});
