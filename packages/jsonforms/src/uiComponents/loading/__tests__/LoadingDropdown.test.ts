import { beforeEach, describe, expect, it } from "vitest";
import { type VueWrapper, mount } from "@vue/test-utils";

import { KdsDataType } from "@knime/kds-components";

import { type VueControlTestProps } from "../../../../testUtils";
import LoadingDropdown from "../LoadingDropdown.vue";

describe("LoadingDropdown", () => {
  let props: VueControlTestProps<typeof LoadingDropdown>, wrapper: VueWrapper;

  const labelForId = "myLabelForId";

  beforeEach(() => {
    props = {
      possibleValues: [
        { id: "first", text: "First" },
        {
          id: "second",
          text: "Second",
          type: { id: "secondType", text: "Second Type" },
        },
        {
          id: "third",
          text: "Third",
          type: { id: "thirdType", text: "Third Type" },
        },
      ],
      modelValue: "first",
      id: labelForId,
      disabled: false,
      ariaLabel: "defaultLabel",
    };

    wrapper = mount(LoadingDropdown, {
      props,
    });
  });

  describe("slot rendering", () => {
    it("does not render a slot if all possibleValues are untyped", async () => {
      await wrapper.setProps({
        possibleValues: [
          { id: "first", text: "First" },
          { id: "second", text: "Second" },
          { id: "third", text: "Third" },
        ],
      });
      expect(wrapper.find(".data-type-entry").exists()).toBeFalsy();
    });

    it("renders an untyped value", () => {
      const slots = wrapper.findAll(".data-type-entry");
      // +1 for the summary entry if the dropdown is not expanded
      expect(slots).toHaveLength(props.possibleValues!.length + 1);
      const summary = slots[0];
      expect(summary.exists()).toBeTruthy();
      expect(summary.findComponent(KdsDataType).exists()).toBeFalsy();
      expect(summary.text()).toBe("First");
    });

    it("renders a typed value", async () => {
      await wrapper.setProps({
        modelValue: "second",
      });
      const slots = wrapper.findAll(".data-type-entry");
      // +1 for the summary entry if the dropdown is not expanded
      expect(slots).toHaveLength(props.possibleValues!.length + 1);
      const summary = slots[0];
      expect(summary.exists()).toBeTruthy();
      expect(summary.findComponent(KdsDataType).exists()).toBeTruthy();
      expect(summary.findComponent(KdsDataType).props()).toStrictEqual({
        iconName: "secondType",
        iconTitle: "Second Type",
        size: "small",
      });
      expect(summary.text()).toBe("Second");
    });

    it("renders a missing value", async () => {
      await wrapper.setProps({
        modelValue: "missingValue",
      });
      const slots = wrapper.findAll(".data-type-entry");
      // +1 for the summary entry if the dropdown is not expanded
      expect(slots).toHaveLength(props.possibleValues!.length + 1);
      const summary = slots[0];
      expect(summary.exists()).toBeTruthy();
      expect(summary.findComponent(KdsDataType).exists()).toBeTruthy();
      expect(summary.text()).toBe("(MISSING) missingValue");
    });

    it("renders without a selected value", async () => {
      await wrapper.setProps({
        modelValue: "",
      });
      const slots = wrapper.findAll(".data-type-entry");
      expect(slots).toHaveLength(props.possibleValues!.length);
      const expectedPlaceholder = "No value selected";
      expect(wrapper.html()).toContain(expectedPlaceholder);
      slots.forEach((slot) => {
        expect(slot.text()).not.toContain(expectedPlaceholder);
      });
    });
  });
});
