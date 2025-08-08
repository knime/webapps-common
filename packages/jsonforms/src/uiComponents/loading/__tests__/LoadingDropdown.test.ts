import { beforeEach, describe, expect, it } from "vitest";
import { type VueWrapper, mount } from "@vue/test-utils";

import { DataType } from "@knime/kds-components";

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
      const slot = wrapper.find(".data-type-entry");
      expect(slot.exists()).toBeTruthy();
      expect(slot.findComponent(DataType).exists()).toBeFalsy();
      expect(slot.text()).toBe("First");
    });

    it("renders a typed value", async () => {
      await wrapper.setProps({
        modelValue: "second",
      });
      const slot = wrapper.find(".data-type-entry");
      expect(slot.exists()).toBeTruthy();
      expect(slot.findComponent(DataType).exists()).toBeTruthy();
      expect(slot.findComponent(DataType).props()).toStrictEqual({
        iconName: "secondType",
        iconTitle: "Second Type",
        size: "small",
      });
      expect(slot.text()).toBe("Second");
    });

    it("renders a missing value", async () => {
      await wrapper.setProps({
        modelValue: "missingValue",
      });
      const slot = wrapper.find(".data-type-entry");
      expect(slot.exists()).toBeTruthy();
      expect(slot.findComponent(DataType).exists()).toBeTruthy();
      expect(slot.text()).toBe("(MISSING) missingValue");
    });
  });
});
