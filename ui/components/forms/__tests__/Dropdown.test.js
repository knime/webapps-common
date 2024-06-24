import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Dropdown from "../Dropdown.vue";
import { isUndefined, cloneDeep } from "lodash-es";

vi.useFakeTimers();

const POSSIBLE_VALUES_MOCK = [
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
  {
    id: "test4",
    text: "Text 4",
  },
  {
    id: "test5",
    text: "Text 5",
  },
];
const ARIA_LABEL_MOCK = "Test Label";
const POSSIBLE_SLOTTED_VALUES_MOCK = [
  {
    id: "test1",
    text: "Text 1",
    slotData: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  {
    id: "test2",
    text: "Text 2",
    slotData: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  {
    id: "test3",
    text: "Text 3",
    slotData: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  {
    id: "test4",
    text: "Text 4",
    slotData: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
  {
    id: "test5",
    text: "Text 5",
    slotData: {
      a: 1,
      b: 2,
      c: 3,
    },
  },
];
const OPTION_SLOT_CONTENT_MOCK = `
  <template #option="{ slotData: { a, b, c } } = { slotData: {}, }">
    {{ a }} {{ b }} {{ c }}
  </template>
`;
const ICON_SLOT_CONTENT_MOCK = "<div> Right</div>";

const doMount = ({
  name = null,
  modelValue = null,
  placeholder = null,
  isValid,
  possibleValues = POSSIBLE_VALUES_MOCK,
  ariaLabel = ARIA_LABEL_MOCK,
  slots = {},
} = {}) => {
  const propsData = {
    possibleValues,
    ariaLabel,
    modelValue,
    placeholder,
    name,
    isValid: isUndefined(isValid) ? true : isValid,
  };
  const wrapper = mount(Dropdown, {
    propsData,
    slots,
  });

  return {
    wrapper,
  };
};

describe("Dropdown.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      possibleValues: [
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
        {
          id: "test4",
          text: "Text 4",
        },
        {
          id: "test5",
          text: "Text 5",
        },
      ],
      ariaLabel: "Test Label",
    };
  });

  it("renders", () => {
    const { wrapper } = doMount();
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );
  });

  it("checks if we have search value", () => {
    const { wrapper } = doMount({
      Dropdown,
    });
    expect(wrapper.vm.activeSearch).toBe(false);

    wrapper.vm.searchValue = "a";
    expect(wrapper.vm.activeSearch).toBe(true);
  });

  it("renders icon slots", () => {
    const { wrapper } = doMount({
      modelValue: "test1",
      slots: { "icon-right": ICON_SLOT_CONTENT_MOCK },
    });
    expect(wrapper.find("[role=button]").text()).toBe("Text 1 Right");
  });

  it("sets the list to render for values", () => {
    const { wrapper } = doMount({
      Dropdown,
    });
    const list = wrapper.vm.filteredPossibleValues;
    expect(list.length).toBeTruthy();
  });

  it("sets the correct aria-* attributes", () => {
    const ariaLabel = "Look mum no label";
    const { wrapper } = doMount({ ariaLabel });
    const button = wrapper.find("[role=button]");
    expect(button.attributes("aria-label")).toBe(ariaLabel);
  });

  it("resets the Dropdown when click outside of Dropdown", async () => {
    const { wrapper } = doMount({
      Dropdown,
    });

    await wrapper.setData({
      searchValue: "",
      isExpanded: false,
      inputOrOptionsFocussed: false,
    });

    wrapper.vm.toggleExpanded();

    await wrapper.setData({ searchValue: "a" });

    expect(wrapper.vm.isExpanded).toBeTruthy();

    wrapper.vm.clickAway();

    expect(wrapper.vm.searchValue).toBe("");
    expect(wrapper.vm.isExpanded).toBeFalsy();
    expect(wrapper.vm.inputOrOptionsFocussed).toBeFalsy();
  });

  it("sets titles from text or optional titles of items", () => {
    const possibleValues = [
      {
        id: "test1",
        text: "Text 1",
        title: "custom title",
      },
      {
        id: "test2",
        text: "Text 2",
      },
    ];
    const ariaLabel = "Test Label";
    const { wrapper } = doMount({
      possibleValues,
      ariaLabel,
    });
    const options = wrapper.findAll("[role=option]");
    expect(options.map((li) => li.attributes().title)).toStrictEqual([
      "custom title",
      "Text 2",
    ]);
  });

  it("renders value text or placeholder if no or empty value set", () => {
    const placeholder = "my-placeholder";
    const value = "test3";
    const { wrapper } = doMount({ placeholder, value });

    const button = wrapper.find("[role=button]");
    expect(button.text()).toBe(placeholder);
    expect(wrapper.vm.isMissing).toBeFalsy();

    wrapper.setProps({ value: null });
    expect(button.text()).toBe(placeholder);
    wrapper.setProps({ value: "" });
    expect(button.text()).toBe(placeholder);
  });

  it("renders a hidden input field to be able to read form data", () => {
    const placeholder = "my-placeholder";
    const modelValue = "test66";
    const name = "test-name";
    const { wrapper } = doMount({
      modelValue,
      name,
      placeholder,
    });
    expect(wrapper.find("[type=hidden]").exists()).toBe(true);
    expect(wrapper.find("[type=hidden]").element.value).toBe(modelValue);
    expect(wrapper.find("[type=hidden]").attributes("name")).toBe(name);
  });

  it("renders invalid value if value is invalid", () => {
    const modelValue = "no";
    const { wrapper } = doMount({ modelValue });
    let button = wrapper.find("[role=button]");
    expect(button.text()).toBe(`(MISSING) ${modelValue}`);
  });

  it("detects that there is a missing value", () => {
    const modelValue = "why no value?";
    const { wrapper } = doMount({ modelValue });
    expect(wrapper.vm.isMissing).toBeTruthy();
  });

  it("renders invalid style", () => {
    const isValid = false;
    const { wrapper } = doMount({
      isValid,
    });
    let root = wrapper.find("div.dropdown");
    expect(root.classes()).toContain("invalid");
  });

  it("opens the listbox on click of button and emits event for clicked value", async () => {
    const { wrapper } = doMount();
    const newValueIndex = 1;
    const listbox = wrapper.find("[role=listbox]");

    // open list
    await wrapper.find("[role=button]").trigger("click");
    expect(listbox.isVisible()).toBe(true);

    const input = wrapper.findAll("li[role=option]")[newValueIndex];

    await input.trigger("click");

    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(
      wrapper.vm.filteredPossibleValues[newValueIndex].id,
    );

    // listbox closed
    expect(listbox.isVisible()).toBe(false);
  });

  it("provides a valid hasSelection method", async () => {
    const { wrapper } = doMount();
    expect(wrapper.vm.hasSelection()).toBe(false);
    await wrapper.setData({ candidate: "test2" });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  it("updates searchValue", () => {
    const { wrapper } = doMount();
    wrapper.vm.handleSearch("a");
    expect(wrapper.vm.searchValue).toBe("a");
  });

  describe.each([
    {
      possibleValues: POSSIBLE_VALUES_MOCK,
      slots: { "icon-right": ICON_SLOT_CONTENT_MOCK },
      type: "dropdown",
    },
    {
      possibleValues: POSSIBLE_SLOTTED_VALUES_MOCK,
      slots: { option: OPTION_SLOT_CONTENT_MOCK },
      type: "slotted dropdown",
    },
  ])("keyboard navigation", ({ possibleValues, slots, type }) => {
    it(`opens and closes the listbox on enter/esc for a ${type}`, async () => {
      const { wrapper } = doMount({ possibleValues, slots });
      let button = wrapper.find("[role=button]");
      let listbox = wrapper.find("[role=listbox]");

      // open list
      await wrapper.find("[role=button]").trigger("keydown", { key: "Enter" });
      expect(listbox.isVisible()).toBe(true);

      // close listbox
      await button.trigger("keydown", { key: "Escape" });
      expect(listbox.isVisible()).toBe(false);
    });

    it(`sets the values on keydown navigation for a ${type}`, () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.vm.candidate).toBe(possibleValues[2].id);
    });

    it(`sets the values on keyup navigation for a ${type}`, () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown", { key: "ArrowUp" });
      expect(wrapper.vm.candidate).toBe(possibleValues[0].id);
    });

    it(`sets no values on keyup navigation at the start for a ${type}`, () => {
      const modelValue = possibleValues[0].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const ul = wrapper.find("ul");
      ul.trigger("keydown.up");
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    });

    it(`sets no values on keydown navigation at the end for a ${type}`, () => {
      const modelValue = possibleValues[possibleValues.length - 1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown.down");
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    });

    it(`sets the values to the first value on home key for a ${type}`, () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown", { key: "Home" });
      expect(wrapper.vm.candidate).toBe(possibleValues[0].id);
    });

    it(`sets the values to the last value on end key for a ${type}`, () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown", { key: "End" });
      expect(wrapper.vm.candidate).toBe(
        possibleValues[possibleValues.length - 1].id,
      );
    });
  });

  describe.each([
    {
      possibleValues: POSSIBLE_VALUES_MOCK,
      slots: { "icon-right": ICON_SLOT_CONTENT_MOCK },
      type: "dropdown",
    },
    {
      possibleValues: POSSIBLE_SLOTTED_VALUES_MOCK,
      slots: { option: OPTION_SLOT_CONTENT_MOCK },
      type: "slotted dropdown",
    },
  ])("keyboard search", ({ possibleValues, slots, type }) => {
    it(`finds the first matching item for a ${type}`, () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown", { key: "t" });
      expect(wrapper.vm.candidate).toBe("test1");
    });

    it(`finds a more exact matching item for a ${type}`, () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");

      button.trigger("keydown", { key: "t" });
      button.trigger("keydown", { key: "e" });
      button.trigger("keydown", { key: "x" });
      button.trigger("keydown", { key: "t" });
      button.trigger("keydown", { key: " " });
      button.trigger("keydown", { key: "4" });

      expect(wrapper.vm.candidate).toBe("test4");
    });

    it(`resets after stop typing for a ${type}`, () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");

      button.trigger("keydown", { key: "t" });
      expect(wrapper.vm.candidate).toBe("test1");

      // stopping typing
      vi.runAllTimers();

      button.trigger("keydown", { key: "t" });
      button.trigger("keydown", { key: "e" });
      button.trigger("keydown", { key: "x" });
      button.trigger("keydown", { key: "t" });
      button.trigger("keydown", { key: " " });
      button.trigger("keydown", { key: "3" });

      expect(wrapper.vm.candidate).toBe("test3");
    });
  });

  describe("slotted Dropdown", () => {
    it("render slots if slotData is given", () => {
      // use a single value to make look-up easier
      const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
      const { wrapper } = doMount({
        possibleValues,
        slots: { option: OPTION_SLOT_CONTENT_MOCK },
      });

      const option = wrapper.find("li");
      expect(option.classes()).toContain("has-option-template");
      expect(option.text()).not.toBe(possibleValues[0].text);

      expect(option.text()).toBe(
        `${possibleValues[0].slotData.a} ${possibleValues[0].slotData.b} ${possibleValues[0].slotData.c}`,
      );
    });

    it("render text slots if slotData is not given", () => {
      // use a single value to make look-up easier
      const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
      delete possibleValues[0].slotData;
      const { wrapper } = doMount({
        possibleValues,
        slots: { option: OPTION_SLOT_CONTENT_MOCK },
      });
      const option = wrapper.find("li");
      expect(option.classes()).not.toContain("slotted");
      expect(option.text()).toBe(possibleValues[0].text);
    });
  });
});
