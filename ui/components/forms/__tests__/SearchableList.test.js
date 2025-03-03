import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SearchInput from "../SearchInput.vue";
import SearchableList from "../SearchableList.vue";
import MultiselectListBox from "../MultiselectListBox.vue";

describe("SearchableList.vue", () => {
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
      size: 3,
      ariaLabel: "label",
    };
    const wrapper = mount(SearchableList, { props });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findComponent(MultiselectListBox).props("possibleValues").length,
    ).toBe(3);
    expect();
  });

  it("renders with null model value", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: null,
      size: 3,
      ariaLabel: "label",
    };
    const wrapper = mount(SearchableList, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findComponent(MultiselectListBox).props("possibleValues").length,
    ).toBe(0);
  });

  it("actual list sizes must be 5 or bigger", async () => {
    let props = {
      possibleValues: [defaultPossibleValues[0]], // one element
      modelValue: ["test3"],
      ariaLabel: "label",
    };
    const wrapper = mount(SearchableList, {
      props,
    });
    const defaultListSize = 5;
    const list1 = wrapper.findComponent(MultiselectListBox);
    // with no size set it is still 5 even if we only have one element
    expect(list1.props("size")).toBe(defaultListSize);
    const smallListSize = 3;
    await wrapper.setProps({ size: smallListSize });
    expect(list1.props("size")).toBe(defaultListSize);
    const bigSize = 12;
    await wrapper.setProps({ size: bigSize });
    expect(list1.props("size")).toBe(bigSize);
  });

  it("isValid causes invalid style on box", async () => {
    let props = {
      possibleValues: [
        {
          id: "test1",
          text: "test1",
        },
      ],
      modelValue: ["text3"],
      isValid: false,
      ariaLabel: "label",
    };
    const wrapper = mount(SearchableList, {
      props,
    });
    let box = wrapper.findComponent({ ref: "form" });
    expect(box.vm.isValid).toBe(false);
    await wrapper.setProps({ isValid: true });
    expect(box.vm.isValid).toBe(true);
  });

  it("has invalid state if invalid values are selected", () => {
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
      ariaLabel: "label",
    };

    const wrapper = mount(SearchableList, {
      props,
    });
    expect(wrapper.vm.invalidValueIds).toStrictEqual(["invalidId"]);
    expect(wrapper.vm.validate().isValid).toBeFalsy();
  });

  it("creates missing items", () => {
    const wrapper = mount(SearchableList, {
      props: {
        possibleValues: defaultPossibleValues,
        modelValue: ["test1", "testMissing"],
      },
    });
    expect(wrapper.vm.visibleValues).toStrictEqual([
      { id: "testMissing", invalid: true, text: "(MISSING) testMissing" },
      ...defaultPossibleValues,
    ]);
  });

  it("provides a valid hasSelection method", async () => {
    const wrapper = mount(SearchableList, {
      props: {
        possibleValues: defaultPossibleValues,
        modelValue: [],
        ariaLabel: "label",
      },
    });
    expect(wrapper.vm.hasSelection()).toBe(false);
    await wrapper.setProps({ modelValue: ["test1"] });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  describe("emit modelValue", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2", "test3"],
        ariaLabel: "label",
      };
    });

    it("updates model value on click in box", async () => {
      const wrapper = mount(SearchableList, {
        props,
      });

      await wrapper.vm.$nextTick();
      wrapper.vm.$emit("update:modelValue", "test3");

      expect(wrapper.emitted("update:modelValue")).toStrictEqual([["test3"]]);
    });

    it("isValid causes invalid style on box", async () => {
      let props = {
        possibleValues: [
          {
            id: "test1",
            text: "test1",
          },
        ],
        modelValue: null,
        isValid: false,
        ariaLabel: "label",
      };
      const wrapper = mount(SearchableList, {
        props,
      });
      let box = wrapper.findComponent({ ref: "form" });
      expect(box.vm.isValid).toBe(false);
      await wrapper.setProps({ isValid: true });
      expect(box.vm.isValid).toBe(true);
    });
  });

  describe("search", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        ariaLabel: "label",
        size: 3,
      };
    });

    it("doesn't render the search bar by default", () => {
      const wrapper = mount(SearchableList, {
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
      let localProps = {
        ...props,
        showSearch: true,
        withSearchLabel: true,
        searchLabel: "Filter entries",
        searchPlaceholder: "Enter search term",
      };
      const wrapper = mount(SearchableList, {
        props: localProps,
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBe(true);
      expect(wrapper.find("div.search-wrapper label").exists()).toBe(true);
      expect(wrapper.find("div.search-wrapper label").text()).toBe(
        "Filter entries",
      );
    });

    it("can include initial search term", async () => {
      let localProps = { ...props, showSearch: true, initialSearchTerm: "3" };
      const wrapper = mount(SearchableList, {
        props: localProps,
      });
      let box = wrapper.findComponent(MultiselectListBox);
      expect(box.props("possibleValues").length).toBe(1);
      expect(box.props("possibleValues")[0].text).toBe("Text 3");
      // Remove search term
      let search = wrapper.find("input");
      await search.setValue("");
      expect(box.props("possibleValues").length).toBe(3);
    });

    it("does not search if showSearch is false", () => {
      let localProps = { ...props, showSearch: false, initialSearchTerm: "3" };
      const wrapper = mount(SearchableList, { props: localProps });
      let box = wrapper.findComponent(MultiselectListBox);
      expect(box.props("possibleValues").length).toBe(3);
    });

    it("can handle basic search requests", async () => {
      let localProps = { ...props, showSearch: true };
      const wrapper = mount(SearchableList, {
        props: localProps,
      });
      let box = wrapper.findComponent(MultiselectListBox);
      expect(box.props("possibleValues").length).toBe(3);
      let search = wrapper.find("input");
      await search.setValue("noresult");
      expect(box.props("possibleValues").length).toBe(0);
      await search.setValue("");
      expect(box.props("possibleValues").length).toBe(3);
      await search.setValue("text");
      expect(box.props("possibleValues").length).toBe(3);
      await search.setValue(" text");
      expect(box.props("possibleValues").length).toBe(0);
      await search.setValue("1");
      expect(box.props("possibleValues").length).toBe(1);
      await search.setValue("2");
      expect(box.props("possibleValues").length).toBe(1);
      await search.setValue(" ");
      expect(box.props("possibleValues").length).toBe(3);
      await search.setValue("TEXT");
      expect(box.props("possibleValues").length).toBe(3);
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });

    it("renders search without label by default", () => {
      const wrapper = mount(SearchableList, {
        props: { ...props, showSearch: true },
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.search-wrapper label");
      expect(labels.length).toBe(0);
    });

    it("renders label if wanted", () => {
      const wrapper = mount(SearchableList, {
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
      let localProps = {
        ...props,
        showSearch: true,
        initialSearchTerm: "text",
      };
      const wrapper = mount(SearchableList, {
        props: localProps,
      });
      let box = wrapper.findComponent(MultiselectListBox);
      expect(box.props("possibleValues").length).toBe(3);
      expect(box.props("possibleValues")[0].text).toBe("Text 1");
      expect(box.props("possibleValues")[1].text).toBe("Text 2");
      expect(box.props("possibleValues")[2].text).toBe("Text 3");
      const childComponent = wrapper.findComponent(SearchInput);
      await childComponent.vm.toggleCaseSensitiveSearch();
      expect(box.props("possibleValues").length).toBe(0);
    });
  });

  describe("unknown values", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        size: 3,
        ariaLabel: "label",
      };
    });

    it("does not render unknown values per default", () => {
      const wrapper = mount(SearchableList, { props });
      expect(wrapper.find('[role="bottom-box"]').exists()).toBeFalsy();
    });

    it("renders unknown values if wanted excluded per default", () => {
      let localProps = {
        ...props,
        withBottomValue: true,
        bottomValue: { id: Symbol("Bottom value"), text: "Bottom value" },
      };
      const wrapper = mount(SearchableList, { props: localProps });
      let bottomBox = wrapper
        .findComponent(MultiselectListBox)
        .find('[role="bottom-box"]');
      expect(bottomBox.exists()).toBe(true);
      expect(bottomBox.text()).toBe(localProps.bottomValue.text);
    });

    describe("search info", () => {
      let props;

      beforeEach(() => {
        props = {
          possibleValues: defaultPossibleValues,
          size: 3,
          showSearch: true,
          modelValue: [],
          ariaLabel: "label",
        };
      });

      it("only shows number of selected values if there is no searchTerm", () => {
        const wrapper = mount(SearchableList, { props });
        expect(wrapper.find(".info").text()).toBe("[ 0 selected ]");
      });

      it("only shows number of selected values if showSearch is false", () => {
        let props = {
          possibleValues: defaultPossibleValues,
          size: 3,
          showSearch: false,
          modelValue: ["test2"],
          ariaLabel: "label",
        };
        const wrapper = mount(SearchableList, { props });

        expect(wrapper.find(".info").text()).toBe("[ 1 selected ]");
      });

      it("shows number of visible items and total number on search", () => {
        let localProps = {
          ...props,
          modelValue: ["test2", "Missing"],
          initialSearchTerm: "2",
        };
        const wrapper = mount(SearchableList, { props: localProps });
        const infos = wrapper.findAll(".info");
        expect(infos.at(0).text()).toBe("1 of 3 entries [ 2 selected ]");
      });
    });

    describe("empty box", () => {
      let props;

      beforeEach(() => {
        props = {
          possibleValues: defaultPossibleValues,
          size: 3,
          showSearch: true,
          modelValue: null,
          ariaLabel: "label",
        };
      });

      it("displays empty state box if it does not contain any element", async () => {
        const wrapper = mount(SearchableList, { props });
        let right = wrapper.findComponent(MultiselectListBox);
        expect(right.find(".empty-state").text()).toBe(
          "No entries in this list",
        );
        const emptyStateLabel = "Custom label";
        await wrapper.setProps({ emptyStateLabel });
        expect(right.find(".empty-state").text()).toBe(emptyStateLabel);
      });

      it("does not display empty state box if wanted", () => {
        props.showEmptyState = false;
        const wrapper = mount(SearchableList, { props });
        let right = wrapper.findComponent(MultiselectListBox);
        expect(right.find(".empty-state").exists()).toBeFalsy();
      });
    });
  });
});
