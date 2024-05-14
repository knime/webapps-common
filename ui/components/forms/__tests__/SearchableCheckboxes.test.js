import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import SearchInput from "../SearchInput.vue";
import SearchableCheckboxes from "../SearchableCheckboxes.vue";
import Checkboxes from "../Checkboxes.vue";

describe("SearchableCheckboxes.vue", () => {
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
    const wrapper = mount(SearchableCheckboxes, { props });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findComponent(Checkboxes).props("possibleValues").length,
    ).toBe(3);
    expect();
  });

  it("it activates scroll bar after mouseenter event on container", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(SearchableCheckboxes, { props });
    wrapper.find(".container").trigger("mouseenter");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(".container").element.style.overflow).toBe("auto");
    });
  });

  it("it hides scroll bar after mouseleave event on container", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: ["test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(SearchableCheckboxes, { props });
    wrapper.find(".container").trigger("mouseleave");
    wrapper.vm.$nextTick(() => {
      expect(wrapper.find(".container").element.style.overflow).toBe("hidden");
    });
  });

  it("renders with null model value", () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: null,
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
      withIsEmptyState: false,
    };
    const wrapper = mount(SearchableCheckboxes, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findComponent(Checkboxes).props("possibleValues").length,
    ).toBe(0);
  });

  it("it makes sure checkboxes has right alignment", async () => {
    let props = {
      possibleValues: defaultPossibleValues,
      modelValue: null,
      leftLabel: "Choose",
      rightLabel: "The value",
      alignment: "vertical",
      size: 3,
      withIsEmptyState: false,
    };
    const wrapper = mount(SearchableCheckboxes, {
      props,
    });

    const calcedStyle = wrapper.vm.cssStyleSize;
    expect(wrapper.find(".container").element.style.height).toBe(
      calcedStyle.height,
    );

    await wrapper.setProps({
      alignment: "horizontal",
    });

    expect(wrapper.find(".container").element.style.height).toBe("auto");
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
    };
    const wrapper = mount(SearchableCheckboxes, {
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

  it("provides a valid hasSelection method", () => {
    const wrapper = mount(SearchableCheckboxes, {
      props: {
        possibleValues: defaultPossibleValues,
        modelValue: [],
      },
    });
    expect(wrapper.vm.hasSelection()).toBe(false);
    wrapper.vm.chosenValues = ["test3"];
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  describe("search", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        size: 3,
      };
    });

    it("doesn't render the search bar by default", () => {
      const wrapper = mount(SearchableCheckboxes, {
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
      const wrapper = mount(SearchableCheckboxes, {
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
      const wrapper = mount(SearchableCheckboxes, {
        props,
      });
      let box = wrapper.findComponent(Checkboxes);
      expect(box.props("possibleValues").length).toBe(1);
      expect(box.props("possibleValues")[0].text).toBe("Text 3");
      // Remove search term
      let search = wrapper.find("input");
      await search.setValue("");
      expect(box.props("possibleValues").length).toBe(3);
    });

    it("does not search if showSearch is false", () => {
      props = { ...props, showSearch: false, initialSearchTerm: "3" };
      const wrapper = mount(SearchableCheckboxes, { props });
      let box = wrapper.findComponent(Checkboxes);
      expect(box.props("possibleValues").length).toBe(3);
    });

    it("can handle basic search requests", async () => {
      props = { ...props, showSearch: true };
      const wrapper = mount(SearchableCheckboxes, {
        props,
      });
      let box = wrapper.findComponent(Checkboxes);
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
      const wrapper = mount(SearchableCheckboxes, {
        props: { ...props, showSearch: true },
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.search-wrapper label");
      expect(labels.length).toBe(0);
    });

    it("renders label if wanted", () => {
      const wrapper = mount(SearchableCheckboxes, {
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
      const wrapper = mount(SearchableCheckboxes, {
        props,
      });
      let box = wrapper.findComponent(Checkboxes);
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
    const expectUnknownValuesAreIncluded = (wrapper) => {
      expect(
        wrapper.findComponent(Checkboxes).find('[role="bottom-box"]').exists(),
      ).toBeFalsy();
    };
    const expectUnknownValuesAreExcluded = (wrapper) => {
      expect(
        wrapper.findComponent(Checkboxes).find('[role="bottom-box"]').exists(),
      ).toBeFalsy();
    };

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        modelValue: ["test2"],
        size: 3,
      };
    });

    it("does not render unknown values per default", () => {
      const wrapper = mount(SearchableCheckboxes, { props });
      expect(wrapper.find('[role="bottom-box"]').exists()).toBeFalsy();
    });

    it("renders unknown values if wanted excluded per default", () => {
      props.showUnknownValues = true;
      const wrapper = mount(SearchableCheckboxes, { props });
      expectUnknownValuesAreExcluded(wrapper);
    });

    it("includes unknown values if wanted", () => {
      props.showUnknownValues = true;
      props.initialIncludeUnknownValues = true;
      const wrapper = mount(SearchableCheckboxes, { props });
      expectUnknownValuesAreIncluded(wrapper);
    });

    describe("search info", () => {
      let props;

      beforeEach(() => {
        props = {
          possibleValues: defaultPossibleValues,
          initialManuallySelected: ["test2"],
          size: 3,
          showSearch: true,
          modelValue: [],
        };
      });

      it("shows no info if search term is empty and mode is manual", () => {
        const wrapper = mount(SearchableCheckboxes, { props });
        expect(wrapper.find(".info").exists()).toBeTruthy();
      });

      it("shows number of visible items and total number on search", () => {
        props.modelValue = ["test2"];
        props.initialSearchTerm = "t";
        const wrapper = mount(SearchableCheckboxes, { props });
        const infos = wrapper.findAll(".info");
        expect(infos.at(0).text()).toBe("3 of 3 entries [ 1 selected ]");
      });

      it("does not show info if search is not shown", () => {
        props.initialSearchTerm = "t";
        props.showSearch = false;

        const wrapper = mount(SearchableCheckboxes, { props });

        expect(wrapper.find(".search-wrapper").exists()).toBeFalsy();
      });
    });

    describe("empty box", () => {
      let props;

      beforeEach(() => {
        props = {
          possibleValues: defaultPossibleValues,
          initialManuallySelected: [],
          size: 3,
          showSearch: true,
          modelValue: null,
        };
      });

      it("displays empty state box if it does not contain any element", async () => {
        const wrapper = mount(SearchableCheckboxes, { props });
        expect(wrapper.find(".empty-state").text()).toBe(
          "No entires in this list",
        );
        const emptyStateLabel = "Custom label";
        await wrapper.setProps({ emptyStateLabel });
        expect(wrapper.find(".empty-state").text()).toBe(emptyStateLabel);
      });

      it("does not display empty state box if wanted", () => {
        props.showEmptyState = false;
        const wrapper = mount(SearchableCheckboxes, { props });
        expect(wrapper.find(".empty-state").exists()).toBeTruthy();
      });
    });

    //   describe("over event", () => {
    //     it("shows the icons if the card is over or not", () => {
    //         const wrapper = mount(SearchableCheckboxes, {
    //             propsData: {}
    //         });
    //         wrapper.find(".container").trigger("mouseenter");
    //         wrapper.vm.$nextTick( () => {
    //           console.log(wrapper.find(".container").element.style)
    //             // expect(wrapper.find(".isAct").text()).contain("remove_red_eye");

    //         });
    //     });
    // });
  });
});
