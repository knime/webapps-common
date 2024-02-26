import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ComboBox from "../ComboBox.vue";
import Multiselect from "../Multiselect.vue";

const doMount = (
  dynamicProps?: Record<string, any>,
  options?: { attachTo: HTMLElement },
) =>
  mount(ComboBox, {
    props: {
      possibleValues: [
        {
          id: "test1",
          text: "test1",
        },
        {
          id: "test2",
          text: "test2",
        },
        {
          id: "test3",
          text: "test3",
        },
      ],
      ...dynamicProps,
    },
    ...options,
  });

describe("ComboBox.vue", () => {
  it("renders", () => {
    const wrapper = doMount();
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.classes()).toContain("multiselect");
    expect(wrapper.find(".summary-input-icon-wrapper")).toBeTruthy();
  });

  it("emits update:modelValue when tag is removed", async () => {
    const wrapper = doMount({
      modelValue: ["test1", "test2", "test3"],
    });

    await wrapper.findAll(".remove-tag-button").at(1)?.trigger("click");

    const modelValue = ["test1", "test3"];
    expect(wrapper.emitted()).toHaveProperty("update:modelValue");
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual([modelValue]);
  });

  it("calls the child function to update focus options when the searchInput changes", async () => {
    const wrapper = doMount();
    const updateFocusSpy = vi.spyOn(
      wrapper.findComponent(Multiselect).vm,
      "updateFocusOptions",
    );
    await wrapper.find({ ref: "searchInput" }).setValue("te");
    expect(updateFocusSpy).toHaveBeenCalled();
  });

  it("sets the size of visible options at maximum to the length of the filtered values", async () => {
    const sizeVisibleOptions = 3;
    const wrapper = doMount({ sizeVisibleOptions });
    const searchInput = wrapper.find({ ref: "searchInput" });

    await searchInput.setValue("test2");
    expect(wrapper.vm.sizeVisibleOptions).toBe(sizeVisibleOptions);

    const multiselectComponent = wrapper.findComponent(Multiselect);
    expect(multiselectComponent.props("possibleValues").length).toBe(1);
    expect(multiselectComponent.props("sizeVisibleOptions")).toBe(1);
  });

  describe("focussing", () => {
    it("opens the multiselect when the input gets focussed and updates focus options", async () => {
      const wrapper = doMount({}, { attachTo: document.body });
      const toggleSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "toggle",
      );
      const updateFocusSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "updateFocusOptions",
      );
      await wrapper.find(".search-input").trigger("focus");
      expect(toggleSpy).toHaveBeenCalled();
      expect(updateFocusSpy).toHaveBeenCalled();
      expect(wrapper.vm.inputOrOptionsFocussed).toBeTruthy();
      expect(wrapper.findComponent(Multiselect).vm.showOptions).toBeTruthy();
      expect(wrapper.findComponent(Multiselect).findAll(".boxes")).toHaveLength(
        3,
      );
    });

    it("clears the search when the focus is outside the ComboBox", async () => {
      const wrapper = doMount({}, { attachTo: document.body });
      await wrapper.find(".summary-input-wrapper").trigger("click");
      const input = wrapper.find({ ref: "searchInput" });

      expect(input.element).toBe(document.activeElement);
      expect(wrapper.vm.inputOrOptionsFocussed).toBeTruthy();

      wrapper.findComponent(Multiselect).vm.$emit("focusOutside");
      expect(wrapper.vm.inputOrOptionsFocussed).toBeFalsy();
      expect(wrapper.vm.searchValue).toBe("");
    });

    it("refocuses the listbox when pressing esc on the dropdown", async () => {
      vi.useFakeTimers();
      const wrapper = doMount({}, { attachTo: document.body });

      wrapper.find(".summary-input-icon-wrapper").trigger("keydown.enter");
      wrapper.find(".search-input").trigger("keydown.down");
      await wrapper.find(".multiselect").trigger("keydown.esc");

      vi.runAllTimers();
      expect(wrapper.find(".summary-input-icon-wrapper").element).toBe(
        document.activeElement,
      );
    });

    it("closes the dropdown when focussing a remove-tag-button", async () => {
      const wrapper = doMount(
        { modelValue: ["test1"] },
        { attachTo: document.body },
      );
      const closeOptionsSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "closeOptions",
      );
      await wrapper.find(".search-input").trigger("focus");
      expect(wrapper.findComponent(Multiselect).vm.showOptions).toBeTruthy();
      await wrapper.find(".remove-tag-button").trigger("click");
      expect(wrapper.findComponent(Multiselect).vm.showOptions).toBeFalsy();
      expect(closeOptionsSpy).toHaveBeenCalled();
    });

    it("closes the dropdown when focussing the remove-all-tags-button", async () => {
      const wrapper = doMount(
        { modelValue: ["test1"] },
        { attachTo: document.body },
      );
      const closeOptionsSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "closeOptions",
      );
      await wrapper.find(".search-input").trigger("focus");
      await wrapper.find(".remove-all-tags-button").trigger("click");
      expect(closeOptionsSpy).toHaveBeenCalled();
    });
  });

  describe("tag interactions", () => {
    it("creates a new tag", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });
      await wrapper.find(".search-input").setValue("another");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.emitted("change")?.[0][0]).toEqual([
        { id: "test2", text: "test2" },
        { id: "test3", text: "test3" },
        { id: "another", text: "another" },
      ]);
    });

    it("removes tags with backspace", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });

      expect(wrapper.findAll(".tag").length).toBe(2);

      await wrapper.find(".search-input").trigger("keydown.backspace");
      expect(wrapper.emitted("change")?.[0][0]).toEqual([
        { id: "test2", text: "test2" },
      ]);
    });

    it("does not create tag when search is empty", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });
      await wrapper.find(".search-input").setValue("");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.findAll(".tag").length).toBe(2);
      expect(wrapper.findAll(".tag").at(-1)?.text()).toMatch("test3");
      expect(wrapper.emitted("change")).toBeUndefined();
    });

    it("does not create repeated tags", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });
      await wrapper.find(".search-input").setValue("another");
      await wrapper.find(".search-input").trigger("keydown.enter");

      await wrapper.find(".search-input").setValue("another");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.emitted("change")?.[0][0]).toEqual([
        { id: "test2", text: "test2" },
        { id: "test3", text: "test3" },
        { id: "another", text: "another" },
      ]);
    });

    it("removes a tag on click of removeTag button", async () => {
      const wrapper = doMount({ modelValue: ["test2", "test3"] });
      const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, "updateSelectedIds");
      await wrapper.findAll(".remove-tag-button").at(0)?.trigger("click");
      expect(updateSelectedIdsSpy).toHaveBeenCalledWith(["test3"]);
      expect(wrapper.emitted("change")?.[0][0]).toEqual([
        { id: "test3", text: "test3" },
      ]);
    });

    it("clears all selected values and closes the options on click of removeAllTags button", async () => {
      const wrapper = doMount(
        { modelValue: ["test2", "test3"] },
        { attachTo: document.body },
      );
      const updateSelectedIdsSpy = vi.spyOn(wrapper.vm, "updateSelectedIds");
      const closeOptionsSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "closeOptions",
      );
      await wrapper.find(".remove-all-tags-button").trigger("click");
      expect(closeOptionsSpy).toHaveBeenCalled();
      expect(updateSelectedIdsSpy).toHaveBeenCalledWith([]);
      expect(wrapper.emitted("change")?.[0][0]).toEqual([]);
    });
  });

  describe("keyboard navigation", () => {
    it("calls onDown on keydown.down on the input", async () => {
      const wrapper = doMount();
      const onDownSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "onDown",
      );
      await wrapper.find({ ref: "searchInput" }).trigger("keydown.down");
      expect(onDownSpy).toHaveBeenCalled();
    });

    it("focusses the wrapper element on keydown.esc on the input", async () => {
      const wrapper = doMount({}, { attachTo: document.body });
      await wrapper.find({ ref: "searchInput" }).trigger("keydown.esc");
      const summaryWrapper = wrapper.find({ ref: "listBox" });
      expect(summaryWrapper.element).toStrictEqual(document.activeElement);
    });
  });
});
