/* eslint-disable max-lines */
import { describe, it, expect, beforeEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";

import SearchInput from "../SearchInput.vue";
import MultiModeTwinlist from "../MultiModeTwinlist.vue";
import MultiselectListBox from "../MultiselectListBox.vue";
import Twinlist from "../Twinlist.vue";
import ValueSwitch from "../ValueSwitch.vue";
import Checkboxes from "../Checkboxes.vue";
import Label from "../Label.vue";
import FilterIcon from "../../..//assets/img/icons/filter.svg";

describe("MultiModeMultiModeTwinlist.vue", () => {
  let defaultPossibleValues;

  const expectBoxValues = (expectedValues, actualValues) => {
    expect(actualValues.length).toBe(expectedValues.length);
    expectedValues.forEach((e, i) => {
      expect(actualValues[i].text).toStrictEqual(e);
    });
  };

  const expectTwinlistIncludes = (wrapper, expectedLeft, expectedRight) => {
    let boxes = wrapper
      .findComponent(Twinlist)
      .findAllComponents(MultiselectListBox);
    let actualLeft = boxes.at(0).props("possibleValues");
    let actualRight = boxes.at(1).props("possibleValues");
    expectBoxValues(expectedLeft, actualLeft);
    expectBoxValues(expectedRight, actualRight);
  };

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

  const assertLeftRightAmount = (wrapper, numLeft, numRight) => {
    expect(
      wrapper
        .findComponent(Twinlist)
        .findAllComponents(MultiselectListBox)
        .at(0).vm.$props.possibleValues.length,
    ).toBe(numLeft);
    expect(
      wrapper
        .findComponent(Twinlist)
        .findAllComponents(MultiselectListBox)
        .at(1).vm.$props.possibleValues.length,
    ).toBe(numRight);
  };

  it("renders", async () => {
    let props = {
      possibleValues: defaultPossibleValues,
      manuallySelected: ["test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(MultiModeTwinlist, {
      props,
    });
    await flushPromises();
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(
      wrapper.findComponent(Twinlist).findAllComponents(MultiselectListBox)
        .length,
    ).toBe(2);
    assertLeftRightAmount(wrapper, 2, 1);
    expect(
      wrapper
        .findComponent(Twinlist)
        .findAllComponents(MultiselectListBox)
        .at(1).vm.$props.possibleValues,
    ).toStrictEqual([defaultPossibleValues[2]]);
  });

  it("renders with null initial manually selected", async () => {
    let props = {
      possibleValues: defaultPossibleValues,
      manuallySelected: null,
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };
    const wrapper = mount(MultiModeTwinlist, {
      props,
    });
    await flushPromises();

    assertLeftRightAmount(wrapper, 0, 0);

    await wrapper.setProps({ manuallySelected: ["test3"] });

    assertLeftRightAmount(wrapper, 2, 1);
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
      manuallySelected: ["invalidId", "test1"],
      leftLabel: "Choose",
      rightLabel: "The value",
    };
    const wrapper = mount(MultiModeTwinlist, {
      props,
    });
    await flushPromises();
    expect(wrapper.vm.validate()).toStrictEqual({
      errorMessage: "One or more of the selected items is invalid.",
      isValid: false,
    });
  });

  it("provides a valid hasSelection method", async () => {
    const wrapper = mount(MultiModeTwinlist, {
      props: {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
      },
    });
    expect(wrapper.vm.hasSelection()).toBe(false);

    await wrapper.setProps({ manuallySelected: ["test1"] });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  it("does not update manually chosen values if mode is not manual", async () => {
    const manuallySelected = ["test1"];
    const wrapper = mount(MultiModeTwinlist, {
      props: {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
        showMode: true,
        manuallySelected,
      },
    });
    await flushPromises();
    expectTwinlistIncludes(wrapper, ["Text 2", "Text 3"], ["Text 1"]);

    // change to regex, where no columns are selected (empty pattern)
    await wrapper.setProps({ mode: "regex" });
    expectTwinlistIncludes(wrapper, ["Text 1", "Text 2", "Text 3"], []);

    // change back to manual
    await wrapper.setProps({ mode: "manual" });
    await wrapper.vm.$nextTick();
    expectTwinlistIncludes(wrapper, ["Text 2", "Text 3"], ["Text 1"]);
  });

  describe("search", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
      };
    });

    it("shows search by default if mode is manual", async () => {
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(
        wrapper.findComponent(Twinlist).findComponent(SearchInput).exists(),
      ).toBeTruthy();
      expect(
        wrapper
          .findComponent(Twinlist)
          .findComponent(SearchInput)
          .findAll("label").length,
      ).toBe(0);
      await wrapper.setProps({ mode: "regex" });
      expect(
        wrapper.findComponent(Twinlist).findComponent(SearchInput).exists(),
      ).toBeFalsy();
    });

    it("does not show search if wanted", () => {
      props.showSearch = false;
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(
        wrapper.findComponent(Twinlist).findComponent(SearchInput).exists(),
      ).toBeFalsy();
    });
  });

  describe("mode selection", () => {
    const props = {
      possibleValues: defaultPossibleValues,
      manuallySelected: ["test3"],
      leftLabel: "Choose",
      rightLabel: "The value",
      size: 3,
    };

    it("does not render the selection mode by default", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props,
      });
      expect(wrapper.findComponent(ValueSwitch).exists()).toBeFalsy();
    });

    it("renders the selection mode if wanted", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
        },
      });
      expect(wrapper.findComponent(ValueSwitch).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.label label");
      expect(labels.at(0).text()).toBe("Manual");
      expect(labels.at(1).text()).toBe("Wildcard");
      expect(labels.at(2).text()).toBe("Regex");
      expect(labels.at(3).text()).toBe("Type");
    });

    it("doesn't render mode labels by default", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
          modeLabel: "Filter options",
        },
      });
      const labels = wrapper
        .findAllComponents(Label)
        .filter((l) => l.find("label").exists());
      expect(
        Array.from(labels).map((l) => l.find("label").text()),
      ).not.toContain("Filter options");
    });

    it("renders the mode label if wanted", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
          withModeLabel: true,
          modeLabel: "Filter options",
        },
      });
      const labels = wrapper
        .findAllComponents(Label)
        .filter((l) => l.find("label").exists());
      expect(Array.from(labels).map((l) => l.find("label").text())).toContain(
        "Filter options",
      );
    });

    it("hides type selection mode if wanted", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
          withTypes: false,
        },
      });
      expect(wrapper.findComponent(ValueSwitch).exists()).toBeTruthy();
      expect(
        wrapper.findAll("div.label label").map((l) => l.text()),
      ).not.toContain("Type");
    });

    it("emits updated mode", async () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
          withTypes: false,
        },
      });
      wrapper.findComponent(ValueSwitch).vm.$emit("update:modelValue", "regex");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:mode")[0][0]).toBe("regex");
    });
  });

  describe("pattern filter", () => {
    it("changes label if pattern mode (regex or widcard) is selected", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          possibleValues: defaultPossibleValues,
          leftLabel: "Choose",
          rightLabel: "The value",
          size: 3,
          mode: "regex",
          withPatternLabel: true,
          patternLabel: "Pattern label",
        },
      });
      expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
      const labels = wrapper.findAll("div.label label");
      expect(labels.at(0).text()).toBe("Pattern label");
    });

    it("selects via regex matching", async () => {
      const props = {
        possibleValues: defaultPossibleValues,
        mode: "regex",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });

      wrapper.findComponent(SearchInput).vm.$emit("update:modelValue", ".*1");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:pattern")[0][0]).toBe(".*1");
      await wrapper.setProps({ pattern: ".*1" });
      expect(wrapper.emitted("update:selected")[0][0]).toStrictEqual(["test1"]);

      expectTwinlistIncludes(wrapper, ["Text 2", "Text 3"], ["Text 1"]);
    });

    it("selects via wildcard matching", async () => {
      const props = {
        possibleValues: defaultPossibleValues,
        mode: "wildcard",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });

      wrapper.findComponent(SearchInput).vm.$emit("update:modelValue", "t*");
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:pattern")[0][0]).toBe("t*");
      await wrapper.setProps({ pattern: "t*" });
      expect(wrapper.emitted("update:selected")[0][0]).toStrictEqual([
        "test1",
        "test2",
        "test3",
      ]);
      expectTwinlistIncludes(wrapper, [], ["Text 1", "Text 2", "Text 3"]);
    });

    it("can do case-sensitive searches", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        manuallySelected: ["test2"],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
        mode: "regex",
        pattern: "t.*2",
      };
      const wrapper = mount(MultiModeTwinlist, {
        props,
      });

      expectTwinlistIncludes(wrapper, ["Text 1", "Text 3"], ["Text 2"]);

      await wrapper.setProps({ caseSensitivePattern: true });

      expectTwinlistIncludes(wrapper, ["Text 1", "Text 2", "Text 3"], []);
    });

    it("can do inverse searches", async () => {
      let props = {
        possibleValues: defaultPossibleValues,
        manuallySelected: ["test2"],
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
        mode: "wildcard",
        pattern: "*3",
      };
      const wrapper = mount(MultiModeTwinlist, {
        props,
      });
      expectTwinlistIncludes(wrapper, ["Text 1", "Text 2"], ["Text 3"]);

      await wrapper.setProps({ inversePattern: true });

      expectTwinlistIncludes(wrapper, ["Text 3"], ["Text 1", "Text 2"]);
    });

    it("prohibits manual selection", () => {
      const props = {
        possibleValues: defaultPossibleValues,
        mode: "regex",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });

      expect(wrapper.findComponent(Twinlist).vm.disabled).toBe(true);
    });

    it("uses filter icon in pattern modes", async () => {
      const props = {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
      };
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
        },
      });
      await wrapper.setProps({ mode: "wildcard" });
      expect(wrapper.findComponent(FilterIcon).exists()).toBeTruthy();
      await wrapper.setProps({ mode: "regex" });
      expect(wrapper.findComponent(FilterIcon).exists()).toBeTruthy();
    });

    it("uses placeholder for pattern modes", async () => {
      const props = {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
        size: 3,
      };
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          ...props,
          showMode: true,
        },
      });
      await wrapper.setProps({ mode: "wildcard" });
      expect(wrapper.find("input[type=text]").attributes("placeholder")).toBe(
        "Pattern",
      );
      await wrapper.setProps({ mode: "regex" });
      expect(wrapper.find("input[type=text]").attributes("placeholder")).toBe(
        "Pattern",
      );
    });
  });

  describe("type selection", () => {
    const possibleValuesWithTypes = [
      {
        id: "test1",
        text: "Text 1",
        type: { id: "StringValue", text: "String" },
      },
      {
        id: "test2",
        text: "Text 2",
        type: { id: "DoubleValue", text: "Double" },
      },
      {
        id: "test3",
        text: "Text 3",
        type: { id: "StringValue", text: "String" },
      },
    ];

    it("does not render type selection without possible types", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          possibleValues: defaultPossibleValues,
          leftLabel: "Choose",
          rightLabel: "The value",
          size: 3,
          mode: "type",
        },
      });
      expect(wrapper.findComponent(Checkboxes).exists()).toBeFalsy();
    });

    it("renders type selection and changes label if type selection is selected", () => {
      const wrapper = mount(MultiModeTwinlist, {
        props: {
          possibleValues: possibleValuesWithTypes,
          leftLabel: "Choose",
          rightLabel: "The value",
          size: 3,
          mode: "type",
          withTypesLabel: true,
          typesLabel: "Types label",
        },
      });
      expect(wrapper.findComponent(Checkboxes).exists()).toBeTruthy();
      expect(wrapper.findComponent(SearchInput).exists()).toBeFalsy();
      const labels = wrapper.findAll("div.label label");
      expect(labels.at(0).text()).toBe("Types label");
    });

    it("selects via type matching", async () => {
      const props = {
        possibleValues: possibleValuesWithTypes,
        mode: "type",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(wrapper.vm.possibleTypes).toStrictEqual([
        { id: "StringValue", text: "String" },
        { id: "DoubleValue", text: "Double" },
      ]);
      wrapper
        .findComponent(Checkboxes)
        .vm.$emit("update:modelValue", ["StringValue"]);
      await wrapper.vm.$nextTick();
      expect(wrapper.emitted("update:selectedTypes")[0][0]).toStrictEqual([
        "StringValue",
      ]);
      await wrapper.setProps({ selectedTypes: ["StringValue"] });
      expect(wrapper.emitted("update:selected")[0][0]).toStrictEqual([
        "test1",
        "test3",
      ]);
      expectTwinlistIncludes(wrapper, ["Text 2"], ["Text 1", "Text 3"]);
    });

    it("takes additionalPossibleTypes into account", () => {
      const additionalPossibleTypes = [
        { id: "StringValue", text: "Different String" },
        { id: "IntValue", text: "Int" },
      ];
      const props = {
        possibleValues: possibleValuesWithTypes,
        additionalPossibleTypes,
        mode: "type",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(wrapper.vm.possibleTypes).toStrictEqual([
        { id: "IntValue", text: "Int" },
        { id: "StringValue", text: "String" },
        { id: "DoubleValue", text: "Double" },
      ]);
    });

    it("prohibits manual selection", () => {
      const props = {
        possibleValues: possibleValuesWithTypes,
        values: [],
        mode: "type",
        leftLabel: "Choose",
        rightLabel: "The value",
      };
      const wrapper = mount(MultiModeTwinlist, { props });

      expect(wrapper.findComponent(Twinlist).vm.disabled).toBe(true);
    });
  });

  describe("unknown columns", () => {
    let props;

    beforeEach(() => {
      props = {
        possibleValues: defaultPossibleValues,
        leftLabel: "Choose",
        rightLabel: "The value",
      };
    });

    it("does not render unknown columns by default", () => {
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(wrapper.findComponent(Twinlist).vm.showUnknownValues).toBeFalsy();
    });

    it("renders and excludes unkown columns by default", () => {
      props.showUnknownValues = true;
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(
        wrapper.findComponent(Twinlist).vm.includeUnknownValues,
      ).toBeFalsy();
    });

    it("does not render unknown columns if wanted", () => {
      props.showUnknownValues = false;
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(wrapper.findComponent(Twinlist).vm.showUnknownValues).toBeFalsy();
    });

    it("does not render unknown columns on non-manual mode", () => {
      props.mode = "regex";
      const wrapper = mount(MultiModeTwinlist, { props });
      expect(wrapper.findComponent(Twinlist).vm.showUnknownValues).toBeFalsy();
    });

    it("emits includeUnknownValuesInput event", async () => {
      const wrapper = mount(MultiModeTwinlist, { props });
      await wrapper
        .findComponent(Twinlist)
        .vm.$emit("update:includeUnknownValues", true);
      expect(wrapper.emitted("update:includeUnknownValues")[0][0]).toBe(true);
    });
  });
});
