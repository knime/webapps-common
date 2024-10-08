import { beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { cloneDeep, isUndefined } from "lodash-es";

import DropdownIcon from "@knime/styles/img/icons/arrow-dropdown.svg";

import FunctionButton from "../../../Buttons/FunctionButton.vue";
import Dropdown from "../Dropdown.vue";

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

const POSSIBLE_VALUES_WITH_GROUPS_MOCK = [
  {
    id: "test1",
    text: "Text 1",
    group: "Group 1",
  },
  {
    id: "test2",
    text: "Text 2",
    group: "Group 1",
  },
  {
    id: "test3",
    text: "Text 3",
    group: "Group 2",
  },
  {
    id: "test4",
    text: "Text 4",
    group: "Group 2",
  },
  {
    id: "test5",
    text: "Text 5",
    group: "Group 3",
  },
];
const OPTION_SLOT_CONTENT_MOCK = `
  <template #option="{ slotData, isMissing, selectedValue, expanded }">
    <div v-if="isMissing">(MISSING) slotted {{selectedValue}}</div>
    <div v-else>{{ slotData.a }} {{ slotData.b }} {{ slotData.c }}</div>
    <div v-if="expanded"> Expanded </div>
  </template>
`;
const ICON_SLOT_CONTENT_MOCK = "<div>Right</div>";

const doMount = ({
  name = null,
  modelValue = null,
  placeholder = null,
  useGroupLabels = false,
  isValid,
  possibleValues = POSSIBLE_VALUES_MOCK,
  ariaLabel = ARIA_LABEL_MOCK,
  slots = {},
  attachTo = null,
} = {}) => {
  const propsData = {
    possibleValues,
    ariaLabel,
    modelValue,
    placeholder,
    name,
    isValid: isUndefined(isValid) ? true : isValid,
    useGroupLabels,
  };
  const wrapper = mount(Dropdown, {
    propsData,
    slots,
    attachTo,
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

  it("renders icon slots", () => {
    const { wrapper } = doMount({
      modelValue: "test1",
      slots: { "icon-right": ICON_SLOT_CONTENT_MOCK },
    });
    expect(wrapper.find("[role=button]").text()).toBe("Text 1Right");
  });

  it("updates searchValue and triggers filtering when search input changes", async () => {
    const { wrapper } = doMount({
      Dropdown,
    });

    await wrapper.find("[role=button]").trigger("click");

    const input = wrapper.find("[role=searchbox]");
    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );
    await input.setValue("4");
    expect(wrapper.vm.currentPossibleValues).toStrictEqual([
      { id: "test4", text: "Text 4" },
    ]);
    expect(wrapper.findAll("[role=option]").length).toBe(1);
    expect(wrapper.vm.candidate).toBe("test4");

    await wrapper.find("[role=button]").trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test4");
  });

  it("closes dropdown and clears search on click away", async () => {
    const modelValue = "test2";
    const { wrapper } = doMount({
      modelValue,
    });

    await wrapper.find("[role=button]").trigger("click");
    expect(wrapper.vm.isExpanded).toBeTruthy();
    const input = wrapper.find("[role=searchbox]");
    await input.setValue("Text 1");
    expect(wrapper.findAll("[role=option]").length).toBe(1);

    document.body.click();
    await flushPromises();

    expect(wrapper.vm.isExpanded).toBeFalsy();

    await wrapper.find("[role=button]").trigger("click");
    expect(wrapper.vm.isExpanded).toBeTruthy();
    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );
  });

  it("sets the correct aria-* attributes", () => {
    const ariaLabel = "Look mum no label";
    const { wrapper } = doMount({ ariaLabel });
    const button = wrapper.find("[role=button]");
    expect(button.attributes("aria-label")).toBe(ariaLabel);
  });

  it("remove the search value clicking the close icon", async () => {
    const { wrapper } = doMount({
      Dropdown,
    });
    await wrapper.find("[role=button]").trigger("click");
    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );

    const input = wrapper.find("[role=searchbox]");
    await input.setValue("Text 1");
    expect(wrapper.findAll("[role=option]").length).toBe(1);

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );
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
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").element.value).toBe(modelValue);
    expect(wrapper.find("input").attributes("name")).toBe(name);
  });

  it("renders invalid value if value is invalid", () => {
    const modelValue = "no";
    const { wrapper } = doMount({ modelValue });
    let button = wrapper.find("[role=button]");
    expect(button.text()).toBe(`(MISSING) ${modelValue}`);
  });

  it("renders invalid slotted value if value is invalid", () => {
    const modelValue = "no";
    const { wrapper } = doMount({
      modelValue,
      possibleValues: POSSIBLE_SLOTTED_VALUES_MOCK,
      slots: { option: OPTION_SLOT_CONTENT_MOCK },
    });
    let button = wrapper.find("[role=button]");
    expect(button.text()).toBe(`(MISSING) slotted ${modelValue}`);
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
    const { wrapper } = doMount({ attachTo: document.body });
    const newValueIndex = 1;
    const listbox = wrapper.find("[role=listbox]");

    // open list
    await wrapper.find("[role=button]").trigger("click");
    expect(listbox.isVisible()).toBe(true);

    const input = wrapper.findAll("li[role=option]")[newValueIndex];
    await input.trigger("click");

    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(
      props.possibleValues[newValueIndex].id,
    );

    // listbox closed
    expect(wrapper.find("[role=listbox]").isVisible()).toBe(false);

    wrapper.unmount();
  });

  it("closes the dropdown without emitting an event when clicking the dropdownIcon", async () => {
    const { wrapper } = doMount({
      attachTo: document.body,
    });
    const listbox = wrapper.find("[role=listbox]");

    // open list
    await wrapper.find("[role=button]").trigger("click");
    expect(listbox.isVisible()).toBe(true);

    const dropdownIconButton = wrapper
      .findAllComponents(FunctionButton)
      .filter((functionButton) =>
        functionButton.findComponent(DropdownIcon).exists(),
      )
      .at(0);
    await dropdownIconButton.trigger("click");

    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    expect(listbox.isVisible()).toBe(false);
  });

  it("provides a valid hasSelection method", async () => {
    const { wrapper } = doMount();
    expect(wrapper.vm.hasSelection()).toBe(false);
    await wrapper.setProps({ modelValue: "test2" });
    expect(wrapper.vm.hasSelection()).toBe(true);
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
      const { wrapper } = doMount({
        modelValue: possibleValues[0].id,
        possibleValues,
        slots,
        attachTo: document.body,
      });
      let button = wrapper.find("[role=button]");
      let listbox = wrapper.find("[role=listbox]");

      // open list
      await wrapper.find("[role=button]").trigger("keydown", { key: "Enter" });
      expect(listbox.isVisible()).toBe(true);

      // close listbox
      await button.trigger("keydown", { key: "Escape" });
      expect(listbox.isVisible()).toBe(false);

      wrapper.unmount();
    });

    it.each(["ArrowDown", "ArrowUp", "Home", "End"])(
      `opens the listbox on %s for a ${type}`,
      async (key) => {
        const modelValue = possibleValues[1].id; // defines start point
        const { wrapper } = doMount({ possibleValues, modelValue, slots });
        let listbox = wrapper.find("[role=listbox]");

        await wrapper.find("[role=button]").trigger("keydown", { key });
        expect(listbox.isVisible()).toBe(true);
      },
    );

    it(`sets the values on keydown navigation for a ${type}`, async () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      await button.trigger("keydown", { key: "Enter" });
      button.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.vm.candidate).toBe(possibleValues[2].id);
    });

    it(`sets the values on keyup navigation for a ${type}`, async () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      await button.trigger("keydown", { key: "Enter" });
      button.trigger("keydown", { key: "ArrowUp" });
      expect(wrapper.vm.candidate).toBe(possibleValues[0].id);
    });

    it(`sets no values on keyup navigation at the start for a ${type}`, () => {
      const modelValue = possibleValues[0].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const ul = wrapper.find("ul");
      ul.trigger("keydown.up");
      expect(wrapper.vm.candidate).toBe(possibleValues[0].id);
    });

    it(`sets no values on keydown navigation at the end for a ${type}`, () => {
      const modelValue = possibleValues[possibleValues.length - 1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      button.trigger("keydown.down");
      expect(wrapper.vm.candidate).toBe(
        possibleValues[possibleValues.length - 1].id,
      );
    });

    it(`sets the values to the first value on home key for a ${type}`, async () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      await button.trigger("keydown", { key: "Enter" });
      button.trigger("keydown", { key: "Home" });
      expect(wrapper.vm.candidate).toBe(possibleValues[0].id);
    });

    it(`sets the values to the last value on end key for a ${type}`, async () => {
      const modelValue = possibleValues[2].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");
      await button.trigger("keydown", { key: "Enter" });
      button.trigger("keydown", { key: "End" });
      expect(wrapper.vm.candidate).toBe(
        possibleValues[possibleValues.length - 1].id,
      );
    });

    it(`sets the candidate to the modelValue and applies the candidate on enter for a ${type}`, async () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.candidate).toBe(modelValue);

      button.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.vm.candidate).toBe(possibleValues[2].id);

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe(
        possibleValues[2].id,
      );

      let listbox = wrapper.find("[role=listbox]");
      expect(listbox.isVisible()).toBe(false);
    });

    it(`does not set the candidate as model value on escape for a ${type}`, async () => {
      const modelValue = possibleValues[1].id; // defines start point
      const { wrapper } = doMount({ possibleValues, modelValue, slots });
      const button = wrapper.find("[role=button]");

      await button.trigger("keydown", { key: "Enter" });
      expect(wrapper.vm.candidate).toBe(modelValue);

      button.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.vm.candidate).toBe(possibleValues[2].id);

      await button.trigger("keydown", { key: "Escape" });
      expect(wrapper.emitted("update:modelValue")).toBeUndefined();
    });
  });

  describe("slotted Dropdown", () => {
    it("render slots if slotData is given", () => {
      // use a single value to make look-up easier
      const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
      const { wrapper } = doMount({
        modelValue: possibleValues[0].id,
        possibleValues,
        slots: { option: OPTION_SLOT_CONTENT_MOCK },
      });
      const selectedValue = wrapper.find("[role=button]");
      expect(selectedValue.text()).toContain(
        `${possibleValues[0].slotData.a} ${possibleValues[0].slotData.b} ${possibleValues[0].slotData.c}`,
      );
      expect(selectedValue.text()).not.toContain("Expanded");

      const option = wrapper.find("li");
      expect(option.classes()).toContain("has-option-template");
      expect(option.text()).not.toBe(possibleValues[0].text);

      expect(option.text()).toContain(
        `${possibleValues[0].slotData.a} ${possibleValues[0].slotData.b} ${possibleValues[0].slotData.c}`,
      );
      expect(option.text()).toContain("Expanded");
    });

    it("render text slots if slotData is not given", () => {
      // use a single value to make look-up easier
      const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
      delete possibleValues[0].slotData;
      const { wrapper } = doMount({
        modelValue: possibleValues[0].id,
        possibleValues,
        slots: { option: OPTION_SLOT_CONTENT_MOCK },
      });

      const selectedValue = wrapper.find("[role=button]");
      expect(selectedValue.text()).toBe(possibleValues[0].text);
      const option = wrapper.find("li");
      expect(option.classes()).not.toContain("slotted");
      expect(option.text()).toBe(possibleValues[0].text);
    });

    it("keeps the height of the slot content when expanding and showing the search", async () => {
      const possibleValues = [cloneDeep(POSSIBLE_SLOTTED_VALUES_MOCK[0])];
      const { wrapper } = doMount({
        modelValue: possibleValues[0].id,
        possibleValues,
        slots: { option: OPTION_SLOT_CONTENT_MOCK },
      });
      Object.defineProperty(wrapper.vm.$refs.slotContainer, "clientHeight", {
        value: 40,
      });
      const button = wrapper.find("[role=button]");
      await button.trigger("click");
      expect(wrapper.vm.slotContainerHeight).toBe(40);
    });
  });

  describe("dropdown with options groups", () => {
    it("render devider between groups", () => {
      const { wrapper } = doMount({
        possibleValues: POSSIBLE_VALUES_WITH_GROUPS_MOCK,
      });

      expect(wrapper.findAll(".group-divider").length).toBe(3);
    });
  });
});
