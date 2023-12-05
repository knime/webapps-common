/* eslint-disable max-lines */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";

import SearchInput from "../SearchInput.vue";
import Twinlist from "../Twinlist.vue";
import MultiselectListBox from "../MultiselectListBox.vue";

describe("Twinlist.vue", () => {
  let defaultPossibleValues;

  beforeEach(() => {
    defaultPossibleValues = [
      {
        id: "test1",
        text: "Text 1",
      },
      {
        id: "test2",
        text: "Text 2",
      },
      {
        id: "test3",
        text: "Text 3",
      },
    ];
  });

  it("renders", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findAllComponents(MultiselectListBox)[0].props("possibleValues")
        .length,
    ).toBe(2);
    expect(
      wrapper.findAllComponents(MultiselectListBox)[1].props("possibleValues"),
    ).toStrictEqual([defaultPossibleValues[2]]);
  });

  it("renders with null model value", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: null,
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findAllComponents(MultiselectListBox)[0].props("possibleValues")
        .length,
    ).toBe(0);
    expect(
      wrapper.findAllComponents(MultiselectListBox)[1].props("possibleValues")
        .length,
    ).toBe(0);
  });

  it("actual list sizes must be 5 or bigger", async () => {
    let props = {
      possibleValues: [defaultPossibleValues[0]], // one element
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    const defaultListSize = 5; // see Twinlist.vue

    const list1 = wrapper.findAllComponents(MultiselectListBox)[0];
    const list2 = wrapper.findAllComponents(MultiselectListBox)[1];

    // with no size set it is still 5 even if we only have one element
    expect(list1.props("size")).toBe(defaultListSize);
    expect(list2.props("size")).toBe(defaultListSize);

    // defaults to 5 (see Twinlist)
    const smallListSize = 3;
    await wrapper.setProps({ size: smallListSize });

    expect(list1.props("size")).toBe(defaultListSize);
    expect(list2.props("size")).toBe(defaultListSize);

    const bigSize = 12;
    await wrapper.setProps({ size: bigSize });

    expect(list1.props("size")).toBe(bigSize);
    expect(list2.props("size")).toBe(bigSize);
  });

  it("isValid causes invalid style on left box", async () => {
    let props = {
      possibleValues: [
        {
          id: "test1",
          text: "test1",
        },
      ],
      leftLabel: "Choose",
      rightLabel: "The value",
      isValid: false,
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    let left = wrapper.findComponent({ ref: "left" });
    expect(left.vm.isValid).toBe(false);
    await wrapper.setProps({ isValid: true });
    expect(left.vm.isValid).toBe(true);
  });

  it("has invalid state if invalid values are selected", async () => {
    let props = {
      possibleValues: [
        {
          id: "test1",
          text: "Text",
        },
        {
          id: "test2",
          text: "Some Text",
        },
      ],
      modelValue: ["invalidId", "test1"],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "One or more of the selected items is invalid.",
      isValid: false,
    });
    expect(wrapper.vm.invalidValueIds).toStrictEqual(["invalidId"]);

    // make it valid again
    await wrapper.setData({ chosenValues: ["test1"] });
    expect(wrapper.vm.validate().isValid).toBe(true);
  });

  it("keeps valid state but removes invalid chosen values on possible values change", async () => {
    let props = {
      possibleValues: [
        {
          id: "test1",
          text: "Text",
        },
        {
          id: "test2",
          text: "Some Text",
        },
      ],
      modelValue: ["invalidId", "test1"],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    expect(wrapper.vm.chosenValues).toStrictEqual(["invalidId", "test1"]);

    await wrapper.setProps({
      possibleValues: [
        {
          id: "test1",
          text: "validValue",
        },
      ],
    });
    expect(wrapper.vm.chosenValues).toStrictEqual(["test1"]);
  });

  it("does not remove invalid chosen values on possible values change if desired", async () => {
    let props = {
      filterChosenValuesOnPossibleValuesChange: false,
      possibleValues: [
        {
          id: "test1",
          text: "Text",
        },
        {
          id: "test2",
          text: "Some Text",
        },
      ],
      modelValue: ["invalidId", "test1"],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });
    expect(wrapper.vm.chosenValues).toStrictEqual(["invalidId", "test1"]);

    await wrapper.setProps({
      possibleValues: [
        {
          id: "test1",
          text: "validValue",
        },
      ],
    });
    expect(wrapper.vm.chosenValues).toStrictEqual(["invalidId", "test1"]);
  });

  it("provides a valid hasSelection method", async () => {
    const wrapper = mount(Twinlist, {
      props: {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
      },
    });
    expect(wrapper.vm.hasSelection()).toBe(false);

    await wrapper.setData({ chosenValues: ["test1"] });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  describe("double click", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
    });

    it("adds to value on double click in left box", async () => {
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      left.vm.$emit("doubleClickOnItem", "test2", 1);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[1],
        props.possibleValues[2],
      ]);
    });

    it("adds values on shift double click in left box", async () => {
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      left.vm.$emit("doubleClickShift", ["test1", "test2"]);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test1",
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[0],
        props.possibleValues[1],
        props.possibleValues[2],
      ]);
    });

    it("removes from value on double click in right box", async () => {
      props.modelValue = ["test2", "test3"];
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      right.vm.$emit("doubleClickOnItem", "test2", 1);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test3",
      ]);
      expect(left.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[0],
        props.possibleValues[1],
      ]);
    });

    it("removes from values on shift double click in right box", async () => {
      props.modelValue = ["test1", "test2", "test3"];
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      right.vm.$emit("doubleClickShift", ["test1", "test2"]);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test3",
      ]);
      expect(left.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[0],
        props.possibleValues[1],
      ]);
    });
  });

  it("moves selected values to right on right arrow key", async () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: [],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });

    let boxes = wrapper.findAllComponents(MultiselectListBox);
    let left = boxes[0];
    let right = boxes[1];
    left.vm.setSelected(["test2", "test3"]);
    left.vm.$emit("keyArrowRight");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
      "test2",
      "test3",
    ]);
    expect(right.vm.$props.possibleValues).toStrictEqual([
      props.possibleValues[1],
      props.possibleValues[2],
    ]);
  });

  it("moves selected values to left on left arrow key", async () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["test2", "test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(Twinlist, {
      props,
    });

    let boxes = wrapper.findAllComponents(MultiselectListBox);
    let left = boxes[0];
    let right = boxes[1];
    right.vm.setSelected(["test2", "test3"]);
    right.vm.$emit("keyArrowLeft");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
    expect(left.vm.$props.possibleValues).toStrictEqual(props.possibleValues);
  });

  describe("controls", () => {
    it("moves selected values to right on move button click", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      left.vm.setSelected(["test2", "test3"]);
      wrapper.find({ ref: "moveRight" }).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[1],
        props.possibleValues[2],
      ]);
    });

    it("moves selected values to left on move button click", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2", "test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      right.vm.setSelected(["test2", "test3"]);
      wrapper.find({ ref: "moveLeft" }).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
      expect(left.vm.$props.possibleValues).toStrictEqual(props.possibleValues);
    });

    it("moves all values to right on all button click", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let right = boxes[1];
      wrapper.find({ ref: "moveAllRight" }).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test1",
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual(
        props.possibleValues,
      );
    });

    it("makes the invalid columns disappear upon moving them to the left", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["invalidId"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];

      // move all left to get the invalid left
      await wrapper.find({ ref: "moveAllLeft" }).trigger("click");
      expect(left.props("possibleValues").map((x) => x.id)).not.toContain(
        "invalidId",
      );
      expect(right.props("possibleValues").map((x) => x.id)).not.toContain(
        "invalidId",
      );
    });

    it("moves all values to left on all button click", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2", "test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      wrapper.find({ ref: "moveAllLeft" }).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
      expect(left.vm.$props.possibleValues).toStrictEqual(props.possibleValues);
    });

    it("moves selected values to right on move button enter", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      left.vm.setSelected(["test2", "test3"]);
      const stopPropagation = vi.fn();
      const preventDefault = vi.fn();
      wrapper
        .find({ ref: "moveRight" })
        .trigger("keydown", { key: "Enter", stopPropagation, preventDefault });
      expect(stopPropagation).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual([
        props.possibleValues[1],
        props.possibleValues[2],
      ]);
    });

    it("non applicable buttons are disabled", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];

      const moveRight = wrapper.find({ ref: "moveRight" });
      const moveLeft = wrapper.find({ ref: "moveLeft" });
      const moveAllLeft = wrapper.find({ ref: "moveAllLeft" });
      const moveAllRight = wrapper.find({ ref: "moveAllRight" });

      // nothing is selected so move selection is disabled
      expect(moveRight.classes()).toContain("disabled");
      expect(moveLeft.classes()).toContain("disabled");

      // move all right is possible
      expect(moveAllRight.classes()).not.toContain("disabled");

      // move all left is not possible as right (the values) is empty
      expect(moveAllLeft.classes()).toContain("disabled");

      await left.vm.setSelected(["test2", "test3"]);

      // now we can move right
      expect(moveRight.classes()).not.toContain("disabled");

      // move all right
      await wrapper.vm.moveRight(["test1", "test2", "test3"]);

      // now we can move all to the left (as we have values)
      expect(moveAllLeft.classes()).not.toContain("disabled");

      // but not the other way around
      expect(moveAllRight.classes()).toContain("disabled");

      // select something on the right
      await right.vm.setSelected(["test2"]);

      // move selected to left is now possible
      expect(moveLeft.classes()).not.toContain("disabled");
    });

    it("moves selected values to left on move button enter", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2", "test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      right.vm.setSelected(["test2", "test3"]);
      const stopPropagation = vi.fn();
      const preventDefault = vi.fn();
      wrapper
        .find({ ref: "moveLeft" })
        .trigger("keydown", { key: "Enter", stopPropagation, preventDefault });
      expect(stopPropagation).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
      expect(left.vm.$props.possibleValues).toStrictEqual(props.possibleValues);
    });

    it("moves all values to right on all button enter", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let right = boxes[1];
      const stopPropagation = vi.fn();
      const preventDefault = vi.fn();
      wrapper
        .find({ ref: "moveAllRight" })
        .trigger("keydown", { key: "Enter", stopPropagation, preventDefault });
      expect(stopPropagation).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test1",
        "test2",
        "test3",
      ]);
      expect(right.vm.$props.possibleValues).toStrictEqual(
        props.possibleValues,
      );
    });

    it("moves all values to left on all button enter", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2", "test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      const stopPropagation = vi.fn();
      const preventDefault = vi.fn();
      wrapper
        .find({ ref: "moveAllLeft" })
        .trigger("keydown", { key: "Enter", stopPropagation, preventDefault });
      expect(stopPropagation).toHaveBeenCalled();
      expect(preventDefault).toHaveBeenCalled();
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([]);
      expect(left.vm.$props.possibleValues).toStrictEqual(props.possibleValues);
    });
  });

  it("clears selection of the other side on select", async () => {
    const mountOptions = {
      props: {
        possibleValues: [
          ...defaultPossibleValues,
          { id: "test4", text: "Text 4" },
        ],
        modelValue: ["test2", "test3"],
        leftLabel: "Choose",
        rightLabel: "The value",
      },
    };

    const wrapper = mount(Twinlist, mountOptions);

    let boxes = wrapper.findAllComponents(MultiselectListBox);
    let left = boxes[0];
    let right = boxes[1];

    // select something on the left
    await wrapper.vm.onLeftInput(["test1"]);
    expect(wrapper.vm.$refs.left.modelValue).toStrictEqual(["test1"]);

    // select something on the right
    await wrapper.vm.onRightInput(["test2"]);
    expect(wrapper.vm.$refs.right.modelValue).toStrictEqual(["test2"]);
    // the left should now be deselecting all
    expect(left.emitted("update:modelValue")[0][0]).toStrictEqual([]);

    // select something on the left, leads to empty on the right
    await wrapper.vm.onLeftInput(["test1", "test4"]);
    expect(right.emitted("update:modelValue")[0][0]).toStrictEqual([]);
  });

  describe("search", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
      };
    });

    it("doesn't render the search bar by default", () => {
      const wrapper = mount(Twinlist, {
        props,
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBe(false);
      expect(wrapper.find("div.search-wrapper label.search").exists()).toBe(
        false,
      );
      expect(
        wrapper.find("div.search-wrapper input[type=text].with-icon").exists(),
      ).toBe(false);
    });

    it("can render the search bar if wanted", () => {
      props = {
        ...props,
        showSearch: true,
        withSearchLabel: true,
        searchLabel: "Filter entries",
        searchPlaceholder: "Enter search term",
      };
      const wrapper = mount(Twinlist, {
        props,
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBe(true);
      expect(wrapper.find("div.search-wrapper label").exists()).toBe(true);
      expect(wrapper.find("div.search-wrapper label").text()).toBe(
        "Filter entries",
      );
    });

    it("can include initial search term", async () => {
      props = { ...props, showSearch: true, initialSearchTerm: "3" };
      const wrapper = mount(Twinlist, {
        props,
      });
      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];

      expect(left.props("possibleValues").length).toBe(1);
      expect(left.props("possibleValues")[0].text).toBe("Text 3");

      expect(right.props("possibleValues").length).toBe(0);

      // Remove search term
      let search = wrapper.find("input");
      await search.setValue("");

      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);
      expect(right.props("possibleValues")[0].text).toBe("Text 2");
    });

    it("does not search if showSearch is false", () => {
      props = { ...props, showSearch: false, initialSearchTerm: "3" };
      const wrapper = mount(Twinlist, { props });
      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes.at(0);
      let right = boxes.at(1);

      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);
    });

    it("can handle basic search requests", async () => {
      props = { ...props, showSearch: true };
      const wrapper = mount(Twinlist, {
        props,
      });
      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];

      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);
      expect(right.props("possibleValues")[0].text).toBe("Text 2");

      let search = wrapper.find("input");

      await search.setValue("noresult");
      expect(left.props("possibleValues").length).toBe(0);
      expect(right.props("possibleValues").length).toBe(0);

      await search.setValue("");
      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);

      await search.setValue("text");
      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);

      await search.setValue(" text");
      expect(left.props("possibleValues").length).toBe(0);
      expect(right.props("possibleValues").length).toBe(0);

      await search.setValue("1");
      expect(left.props("possibleValues").length).toBe(1);
      expect(right.props("possibleValues").length).toBe(0);

      await search.setValue("2");
      expect(left.props("possibleValues").length).toBe(0);
      expect(right.props("possibleValues").length).toBe(1);

      await search.setValue(" ");
      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);

      await search.setValue("TEXT");
      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);

      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("moves only all filtered values to right on all button click", async () => {
      props = {
        ...props,
        showSearch: true,
        initialSearchTerm: "3",
        modelValue: [],
      };
      const wrapper = mount(Twinlist, {
        props,
      });

      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes[0];
      let right = boxes[1];
      await wrapper.find({ ref: "moveAllRight" }).trigger("click");
      expect(wrapper.emitted("update:modelValue")[0][0]).toStrictEqual([
        "test3",
      ]);

      expect(left.props("possibleValues").length).toBe(0);

      let search = wrapper.find("input");

      await search.setValue("");
      expect(left.props("possibleValues").length).toBe(2);
      expect(right.props("possibleValues").length).toBe(1);
    });

    it("does not render search by default", () => {
      const wrapper = mount(Twinlist, {
        props,
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeFalsy();
    });

    it("renders search without label by default", () => {
      const wrapper = mount(Twinlist, {
        props: {
          ...props,
          showSearch: true,
        },
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.search-wrapper label");
      expect(labels.length).toBe(0);
    });

    it("renders label if wanted", () => {
      const wrapper = mount(Twinlist, {
        props: {
          ...props,
          showSearch: true,
          withSearchLabel: true,
          searchLabel: "Search term label",
        },
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.search-wrapper label");
      expect(labels.at(0).text()).toBe("Search term label");
    });

    it("can do case-sensitive searches", async () => {
      props = { ...props, showSearch: true, initialSearchTerm: "text" };
      const wrapper = mount(Twinlist, {
        props,
      });
      let boxes = wrapper.findAllComponents(MultiselectListBox);
      let left = boxes.at(0);
      let right = boxes.at(1);

      expect(left.props("possibleValues").length).toBe(2);
      expect(left.props("possibleValues")[0].text).toBe("Text 1");
      expect(left.props("possibleValues")[1].text).toBe("Text 3");

      expect(right.props("possibleValues").length).toBe(1);
      expect(right.props("possibleValues")[0].text).toBe("Text 2");

      await wrapper.setData({ caseSensitiveSearch: true });

      expect(left.props("possibleValues").length).toBe(0);
      expect(right.props("possibleValues").length).toBe(0);
    });
  });

  describe("unknown values", () => {
    let props;

    const expectUnknownValuesAreIncluded = (wrapper) => {
      expect(
        wrapper
          .findAllComponents(MultiselectListBox)
          .at(0)
          .find('[role="bottom-box"]')
          .exists(),
      ).toBeFalsy();
      expect(
        wrapper
          .findAllComponents(MultiselectListBox)
          .at(1)
          .find('[role="bottom-box"]')
          .exists(),
      ).toBeTruthy();
    };
    const expectUnknownValuesAreExcluded = (wrapper) => {
      expect(
        wrapper
          .findAllComponents(MultiselectListBox)
          .at(0)
          .find('[role="bottom-box"]')
          .exists(),
      ).toBeTruthy();
      expect(
        wrapper
          .findAllComponents(MultiselectListBox)
          .at(1)
          .find('[role="bottom-box"]')
          .exists(),
      ).toBeFalsy();
    };

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
      };
    });

    it("does not render unknown values per default", () => {
      const wrapper = mount(Twinlist, { props });
      expect(wrapper.find('[role="bottom-box"]').exists()).toBeFalsy();
    });

    it("renders unknown values if wanted excluded per default", () => {
      props.showUnknownValues = true;
      const wrapper = mount(Twinlist, { props });
      expectUnknownValuesAreExcluded(wrapper);
    });

    it("includes unknown values if wanted", () => {
      props.showUnknownValues = true;
      props.initialIncludeUnknownValues = true;
      const wrapper = mount(Twinlist, { props });
      expectUnknownValuesAreIncluded(wrapper);
    });

    describe("excluded", () => {
      beforeEach(() => {
        props.showUnknownValues = true;
        props.initialIncludeUnknownValues = false;
      });

      it("moves unknown values right on moveAllRightButton", async () => {
        const wrapper = mount(Twinlist, { props });
        const leftBox = wrapper.findAllComponents(MultiselectListBox).at(0);
        leftBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await wrapper.find({ ref: "moveAllRight" }).trigger("click");
        expectUnknownValuesAreIncluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(true);
      });

      it("moves unkown values right if selected on moveRightButton", async () => {
        const wrapper = mount(Twinlist, { props });
        const leftBox = wrapper.findAllComponents(MultiselectListBox).at(0);
        await leftBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await wrapper.find({ ref: "moveRight" }).trigger("click");
        expectUnknownValuesAreIncluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(true);
      });

      it("moves unkown values right if selected on right arrow key", async () => {
        const wrapper = mount(Twinlist, { props });
        const leftBox = wrapper.findAllComponents(MultiselectListBox).at(0);
        await leftBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await leftBox.find('[role="listbox"]').trigger("keydown.right");
        expectUnknownValuesAreIncluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(true);
      });

      it("moveAllRight buttons is not disabled", () => {
        props.modelValue = props.possibleValues.map((val) => val.id);
        const wrapper = mount(Twinlist, { props });
        const moveAllRight = wrapper.find({ ref: "moveAllRight" });
        expect(moveAllRight.classes()).not.toContain("disabled");
      });
    });

    describe("included", () => {
      beforeEach(() => {
        props.showUnknownValues = true;
        props.initialIncludeUnknownValues = true;
      });

      it("moves unknown values left on moveAllLeftButton", async () => {
        const wrapper = mount(Twinlist, { props });
        const rightBox = wrapper.findAllComponents(MultiselectListBox).at(1);
        await rightBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await wrapper.find({ ref: "moveAllLeft" }).trigger("click");
        expectUnknownValuesAreExcluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(false);
      });

      it("moves unkown values left if selected on moveLeftButton", async () => {
        const wrapper = mount(Twinlist, { props });
        const rightBox = wrapper.findAllComponents(MultiselectListBox).at(1);
        await rightBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await wrapper.find({ ref: "moveLeft" }).trigger("click");
        expectUnknownValuesAreExcluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(false);
      });

      it("moves unkown values left if selected on left arrow key", async () => {
        const wrapper = mount(Twinlist, { props });
        const rightBox = wrapper.findAllComponents(MultiselectListBox).at(1);
        await rightBox
          .find('[role="bottom-box"]')
          .find('[role="option"]')
          .trigger("click");
        await rightBox.find('[role="listbox"]').trigger("keydown.left");
        expectUnknownValuesAreExcluded(wrapper);
        expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(false);
      });

      it("moveAllLeft buttons is not disabled", () => {
        props.modelValue = [];
        const wrapper = mount(Twinlist, { props });
        const moveAllLeft = wrapper.find({ ref: "moveAllLeft" });
        expect(moveAllLeft.classes()).not.toContain("disabled");
      });
    });
  });

  describe("search info", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        initialManuallySelected: ["test2"],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
        showSearch: true,
      };
    });

    it("shows no info if search term is empty and mode is manual", () => {
      const wrapper = mount(Twinlist, { props });
      expect(wrapper.find("info").exists()).toBeFalsy();
    });

    it("shows number of visible items and total number on search", () => {
      props.modelValue = ["test2", "Missing"];
      props.initialSearchTerm = "t";
      const wrapper = mount(Twinlist, { props });
      const infos = wrapper.findAll(".info");
      expect(infos.at(0).text()).toBe("2 of 2 entries");
      expect(infos.at(1).text()).toBe("1 of 2 entries");
    });

    it("does not show info if search is not shown", () => {
      props.initialSearchTerm = "t";
      props.showSearch = false;
      const wrapper = mount(Twinlist, { props });
      expect(wrapper.find(".info").exists()).toBeFalsy();
    });
  });

  describe("empty box", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        initialManuallySelected: [],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
        showSearch: true,
      };
    });

    it("displays empty state box if it does not contain any element", async () => {
      const wrapper = mount(Twinlist, { props });
      let right = wrapper.findAllComponents(MultiselectListBox)[1];
      expect(right.find(".empty-state").text()).toBe("No entries in this list");
      const emptyStateLabel = "Custom label";
      await wrapper.setProps({ emptyStateLabel });
      expect(right.find(".empty-state").text()).toBe(emptyStateLabel);
    });

    it("does not display empty state box if wanted", () => {
      props.showEmptyState = false;
      const wrapper = mount(Twinlist, { props });
      let right = wrapper.findAllComponents(MultiselectListBox)[1];
      expect(right.find(".empty-state").exists()).toBeFalsy();
    });
  });
});
