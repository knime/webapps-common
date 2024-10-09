/* eslint-disable max-nested-callbacks */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RouterLinkStub, mount } from "@vue/test-utils";

import BaseMenuItems from "../BaseMenuItems.vue";

describe("BaseMenuItems.vue", () => {
  it("renders the items", () => {
    const items = [
      { href: "https://www.google.com/slash", text: "Google Slash" },
      { href: "https://www.linkedin.com", text: "Linked" },
      { to: "/relative/route", text: "Everything is relative" },
    ];
    const NuxtLink = RouterLinkStub;
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
      global: {
        stubs: {
          NuxtLink,
        },
      },
    });
    expect(wrapper.findAll("li").length).toBe(items.length);

    // Test texts
    items.forEach((item, index) => {
      expect(wrapper.find(`li:nth-child(${index + 1})`).text()).toBe(
        items[index].text,
      );
    });

    // Test links
    expect(wrapper.find("li:nth-child(1) a").attributes("href")).toBe(
      items[0].href,
    );
    expect(wrapper.find("li:nth-child(2) a").attributes("href")).toBe(
      items[1].href,
    );
    expect(wrapper.findComponent(NuxtLink).props("to")).toBe(items[2].to);
  });

  it("renders with disabled items", () => {
    const items = [
      {
        text: "Apples",
        disabled: false,
        hotkeyText: "CTRL + A",
      },
      {
        text: "Oranges",
        userData: {
          storeAction: "oranges/execute",
        },
        disabled: true,
      },
      {
        text: "Ananas",
        hotkeyText: "F9",
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    const menuEntries = wrapper.findAll(".clickable-item");
    const menuEntry1 = menuEntries[1];
    expect(menuEntry1.classes()).toContain("disabled");
  });

  it("renders with separators", () => {
    const items = [
      {
        text: "Apples",
        disabled: false,
        separator: true,
      },
      {
        text: "Oranges",
        disabled: true,
      },
      {
        text: "Ananas",
        hotkeyText: "F9",
        separator: true,
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    const menuLineItems = wrapper.findAll("li");
    expect(menuLineItems[0].classes()).toContain("separator");
    expect(menuLineItems[1].classes()).not.toContain("separator");
    expect(menuLineItems[2].classes()).toContain("separator");
  });

  it("renders with sectionHeadlines", () => {
    const items = [
      {
        text: "Apples",
        disabled: false,
        separator: true,
        sectionHeadline: true,
      },
      {
        text: "Oranges",
        disabled: true,
        sectionHeadline: true,
        separator: true,
      },
      {
        text: "Ananas",
        hotkeyText: "F9",
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    const listItems = wrapper.findAll(".list-item");
    expect(listItems[0].classes()).toContain("section-headline");
    expect(listItems[1].classes()).toContain("section-headline");
    expect(listItems[2].classes()).not.toContain("section-headline");
  });

  it("renders with selected items", () => {
    const items = [
      {
        text: "Apples",
        disabled: false,
        selected: true,
      },
      {
        text: "Oranges",
        disabled: true,
      },
      {
        text: "Ananas",
        hotkeyText: "F9",
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    const clickableItems = wrapper.findAll(".clickable-item");
    expect(clickableItems[0].classes()).toContain("selected");
    expect(clickableItems[1].classes()).not.toContain("selected");
    expect(clickableItems[2].classes()).not.toContain("selected");
  });

  it("renders with download attribute", () => {
    const items = [
      {
        text: "Apples",
        download: true,
      },
      {
        text: "Oranges",
        href: "some/file/oranges.pdf",
        download: true,
      },
      {
        text: "Pineapples",
        hotkeyText: "F9",
      },
      {
        text: "Kiwis",
        href: "some/file/kiwis.pdf",
      },
      {
        text: "Honey",
        href: "some/file/honey.pdf",
        download: "badger",
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    expect(wrapper.html()).toBeTruthy();
    const clickableItems = wrapper.findAll(".clickable-item");
    expect(clickableItems[0].attributes("download")).toBeUndefined();
    expect(clickableItems[1].attributes("download")).toBeDefined();
    expect(clickableItems[1].attributes("download")).toBe("");
    expect(clickableItems[2].attributes("download")).toBeUndefined();
    expect(clickableItems[3].attributes("download")).toBeUndefined();
    expect(clickableItems[4].attributes("download")).toBe("badger");
  });

  it("has a function returning the enabled element and its index", () => {
    const items = [
      {
        text: "Apples",
        disabled: false,
        selected: true,
      },
      {
        text: "Oranges",
        disabled: true,
      },
      {
        text: "Ananas",
        hotkeyText: "F9",
      },
    ];

    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });

    const firstResult = {
      element: wrapper.find("li").element,
      onClick: expect.any(Function),
      index: 0,
    };

    const secondResult = {
      element: wrapper.findAll("li")[2].element,
      onClick: expect.any(Function),
      index: 2,
    };

    expect(wrapper.vm.getEnabledListItems()).toStrictEqual([
      firstResult,
      secondResult,
    ]);
  });

  it("can display hotkeys", () => {
    const id = "testfoobar543";
    const items = [
      {
        href: "https://www.google.com/slash",
        text: "Google Slash",
        hotkeyText: "ctrl + 1",
      },
      {
        href: "https://www.link.me.in",
        text: "Linked Thing",
        hotkeyText: "ctrl +",
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
        id,
      },
    });
    const spans = wrapper.findAll("span");
    const span = spans[1];
    expect(span.classes("hotkey")).toBe(true);
  });

  it("doesn't display hotkeys by default", () => {
    const id = "testfoobar543";
    const items = [
      { href: "https://www.google.com/slash", text: "Google Slash" },
      { href: "https://www.link.me.in", text: "Linked Thing" },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
        id,
      },
    });
    wrapper.findAll("span").forEach((item) => {
      expect(item.classes("hotkey")).toBe(false);
    });
  });

  it("displays a title for items", () => {
    const id = "testfoobar543";
    const items = [
      {
        href: "https://www.google.com/slash",
        text: "Google Slash",
        title: "This is an example title",
      },
      { href: "https://www.link.me.in", text: "Linked Thing" },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
        id,
      },
    });
    expect(wrapper.findAll("li")[0].attributes("title")).toMatch(
      "This is an example title",
    );
    expect(wrapper.findAll("li")[1].attributes("title")).toBeUndefined();
  });

  it("renders checkboxes correctly", () => {
    const items = [
      {
        text: "Apples",
        download: true,
      },
      {
        text: "Checkbox1",
        checkbox: {
          checked: true,
        },
      },
      {
        text: "Checkbox2",
        checkbox: {
          checked: false,
        },
      },
    ];
    const wrapper = mount(BaseMenuItems, {
      props: {
        menuAriaLabel: "label",
        items,
      },
    });
    const checkboxItems = wrapper.findAll(".checkbox");
    expect(checkboxItems.length).toBe(2);
  });

  describe("clicking menu items", () => {
    let wrapper;
    const setCheckboxValue = vi.fn();
    const items = [
      { text: "Button" },
      {
        href: "https://www.google.com/slash",
        text: "Google Slash",
        randomProp: "test",
      },
      { to: "/testing-nuxt-link", text: "Nuxt link", anotherProp: "foo" },
      { text: "Disabled", disabled: true },
      { text: "Section Headline", sectionHeadline: true },
      {
        text: "Checkbox",
        checkbox: { checked: false, setBoolean: setCheckboxValue },
      },
    ];
    const id = "testfoobar543";

    beforeEach(() => {
      wrapper = mount(BaseMenuItems, {
        props: {
          menuAriaLabel: id,
          items,
          id,
        },
      });
    });

    it("emits item-click", async () => {
      await wrapper.findAll("li")[0].trigger("click");
      expect(wrapper.emitted("item-click")[0]).toStrictEqual([
        expect.anything(),
        items[0],
        id,
      ]);

      await wrapper.findAll("li")[1].trigger("click");
      expect(wrapper.emitted("item-click")[1]).toStrictEqual([
        expect.anything(),
        items[1],
        id,
      ]);

      await wrapper.findAll("li")[2].trigger("click");
      expect(wrapper.emitted("item-click")[2]).toStrictEqual([
        expect.anything(),
        items[2],
        id,
      ]);
    });

    it("does nothing if item is disabled", () => {
      wrapper.findAll("li")[3].trigger("click");
      expect(wrapper.emitted("item-click")).toBeFalsy();
    });

    it("does nothing if item is section headline", () => {
      wrapper.findAll("li")[4].trigger("click");
      expect(wrapper.emitted("item-click")).toBeFalsy();
    });

    it("does not emit item-click and instead calls setBoolean for checkbox items", async () => {
      await wrapper.findAll("li")[5].trigger("click");
      expect(wrapper.emitted("item-click")).toBeUndefined();
      expect(setCheckboxValue).toHaveBeenCalledWith(true);
    });

    it("prevents default on button click", () => {
      const event = new Event("click");
      event.preventDefault = vi.fn();
      event.stopPropagation = vi.fn();
      event.stopImmediatePropagation = vi.fn();
      wrapper.findAll("li")[0].element.dispatchEvent(event);
      expect(event.preventDefault).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
      expect(event.stopImmediatePropagation).toHaveBeenCalled();
    });
  });

  it("marks current focused item", () => {
    const focusedItemIndex = 1;
    const wrapper = mount(BaseMenuItems, {
      props: {
        focusedItemIndex,
        menuAriaLabel: "label",
        items: [{ text: "First" }, { text: "Second" }, { text: "Third" }],
      },
      attachTo: document.body,
    });
    const currentfocusedElement = wrapper
      .findAll("li")
      [focusedItemIndex].find("*");
    expect(currentfocusedElement.classes().includes("focused")).toBeTruthy();
    const nonfocusedElement = wrapper
      .findAll("li")
      [focusedItemIndex + 1].find("*");
    expect(nonfocusedElement.classes().includes("focused")).toBeFalsy();
  });

  describe("interactions", () => {
    let items, wrapper;

    beforeEach(() => {
      items = [
        { text: "First" },
        { text: "Second", disabled: true },
        { text: "Third" },
      ];

      wrapper = mount(BaseMenuItems, {
        props: {
          menuAriaLabel: "label",
          items,
          id: "menu",
        },
        attachTo: document.body,
      });
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it("emits @item-focused initially", () => {
      expect(wrapper.emitted("item-focused")[0]).toStrictEqual([null, null]);
    });

    it("emits @item-focused on focused item index change and when items change", async () => {
      const focusedItemIndex = 2;
      await wrapper.setProps({ focusedItemIndex });
      const focusedItemId = "menu-item-menu-2";
      expect(wrapper.emitted("item-focused")[1]).toStrictEqual([
        focusedItemId,
        { text: "Third" },
      ]);
      expect(wrapper.find(`#${focusedItemId}.focused`).exists()).toBeTruthy();

      const newItems = items.concat({ text: "Fourth" });

      await wrapper.setProps({ items: newItems });

      // new emission, but same focused index
      expect(wrapper.emitted("item-focused")[2]).toStrictEqual([
        focusedItemId,
        { text: "Third" },
      ]);
    });

    it("emits @item-hovered on enabled list items", () => {
      let listElements = wrapper.findAll("li");

      // enabled element
      listElements[0].trigger("pointerenter");
      expect(wrapper.emitted("item-hovered")[0]).toStrictEqual([
        items[0],
        "menu",
        0,
      ]);
    });

    it("emits empty @item-hovered on disabled list items", () => {
      let listElements = wrapper.findAll("li");

      // disabled element
      listElements[1].trigger("pointerenter");
      expect(wrapper.emitted("item-hovered")[0]).toStrictEqual([
        null,
        "menu",
        1,
      ]);
    });

    it("emits empty @item-hovered on the menu", () => {
      let menu = wrapper.findComponent(BaseMenuItems).find("ul");

      menu.trigger("pointerleave");
      expect(wrapper.emitted("item-hovered")[0]).toStrictEqual([null, "menu"]);
    });
  });
});
