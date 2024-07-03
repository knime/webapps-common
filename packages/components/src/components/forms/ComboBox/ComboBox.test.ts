import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";

import ComboBox from "./ComboBox.vue";
import Multiselect from "../Multiselect/Multiselect.vue";

const possibleValues = [
  {
    id: "test1",
    text: "Test1",
  },
  {
    id: "test2",
    text: "Test2",
  },
  {
    id: "test3",
    text: "Test3",
  },
];

const doMount = (
  dynamicProps?: Record<string, any>,
  options?: { attachTo: HTMLElement },
) =>
  mount(ComboBox, {
    props: {
      possibleValues,
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
    expect(multiselectComponent.props("possibleValues")!.length).toBe(1);
    expect(multiselectComponent.props("sizeVisibleOptions")).toBe(1);
  });

  it("has reactive possible values when new values cannot be added", async () => {
    const newPossibleValues = [
      {
        id: "newPossibleValue",
        text: "newPossibleValue",
      },
    ];
    const wrapper = doMount({ possibleValues });

    expect(wrapper.vm.allPossibleItems).toStrictEqual(possibleValues);

    await wrapper.setProps({
      possibleValues: newPossibleValues,
    });
    expect(wrapper.vm.allPossibleItems).toStrictEqual(newPossibleValues);
  });

  it("doesn't have reactive possible values when new values can be added", async () => {
    const possibleValuesCopy = [...possibleValues];
    const wrapper = doMount({
      possibleValues: possibleValuesCopy,
      allowNewValues: true,
    });

    possibleValuesCopy.push({
      id: "newPossibleValue",
      text: "newPossibleValue",
    });
    expect(wrapper.vm.allPossibleItems).toStrictEqual(possibleValues);

    await wrapper.setProps({
      possibleValues: [{ id: "newPossibleValue", text: "newPossibleValue" }],
    });
    expect(wrapper.vm.allPossibleItems).toStrictEqual(possibleValues);
  });

  it("renders invalid possible values for modelValue entries that are not present in the possible values", () => {
    const missingId = "missing";
    const wrapper = doMount({ modelValue: [possibleValues[0].id, missingId] });
    expect(wrapper.vm.selectedValues).toStrictEqual([
      possibleValues[0],
      {
        id: missingId,
        text: `(MISSING) ${missingId}`,
        invalid: true,
      },
    ]);
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
    it("creates a new tag with the trimmed search value as id and text", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });
      await wrapper.find(".search-input").setValue(" another   ");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual([
        "test2",
        "test3",
        "another",
      ]);
    });

    it.each([
      ["text", "Test1"],
      ["id", "test1"],
    ])(
      "does not create a new tag if it would have the same %s as an existing one",
      async (_, searchInput) => {
        const wrapper = doMount({
          modelValue: ["test2", "test3"],
          allowNewValues: true,
        });
        await wrapper.find(".search-input").setValue(searchInput);
        await wrapper.find(".search-input").trigger("keydown.enter");

        expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual([
          "test2",
          "test3",
          "test1",
        ]);
        expect(wrapper.vm.allPossibleItems).toStrictEqual(possibleValues);
      },
    );

    it("removes tags with backspace", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });

      expect(wrapper.findAll(".tag").length).toBe(2);

      await wrapper.find(".search-input").trigger("keydown.backspace");
      expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual(["test2"]);
    });

    it("does not create tag when search is empty", async () => {
      const wrapper = doMount({
        modelValue: ["test2", "test3"],
        allowNewValues: true,
      });
      await wrapper.find(".search-input").setValue("");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.findAll(".tag").length).toBe(2);
      expect(wrapper.findAll(".tag").at(-1)?.text()).toMatch("Test3");
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("does not create repeated tags", async () => {
      const wrapper = doMount({
        allowNewValues: true,
        "onUpdate:modelValue": async (modelValue: string[]) => {
          await wrapper.setProps({ modelValue });
        },
      });

      await wrapper.find(".search-input").setValue("   another");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
      expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual(["another"]);
      expect(wrapper.vm.modelValue).toStrictEqual(["another"]);

      await wrapper.find(".search-input").setValue("another   ");
      await wrapper.find(".search-input").trigger("keydown.enter");

      expect(wrapper.emitted("update:modelValue")).toHaveLength(1);
    });

    it("removes a tag on click of removeTag button", async () => {
      const wrapper = doMount({ modelValue: ["test2", "test3"] });
      await wrapper.findAll(".remove-tag-button").at(0)?.trigger("click");
      expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual(["test3"]);
    });

    it("clears all selected values and closes the options on click of removeAllTags button", async () => {
      const wrapper = doMount(
        { modelValue: ["test2", "test3"] },
        { attachTo: document.body },
      );
      const closeOptionsSpy = vi.spyOn(
        wrapper.findComponent(Multiselect).vm,
        "closeOptions",
      );
      await wrapper.find(".remove-all-tags-button").trigger("click");
      expect(closeOptionsSpy).toHaveBeenCalled();
      expect(wrapper.emitted("update:modelValue")?.[0][0]).toEqual([]);
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
