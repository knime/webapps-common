import { expect } from "vitest";
import { nextTick } from "vue";
import { type DOMWrapper, mount } from "@vue/test-utils";

import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import DateTimeFormatInput from "../DateTimeFormatInput.vue";
import type {
  FormatCategory,
  FormatDateType,
  FormatWithExample,
} from "../utils/types";

export const DEFAULT_FORMATS: FormatWithExample[] = [
  // standard
  {
    format: "yyyy-MM-dd-'blahblahblah'",
    temporalType: "DATE",
    category: "STANDARD",
    example: "2021-01-01-blahblahblah",
  },
  {
    format: "yyyy-MM-dd-yyyy",
    temporalType: "DATE",
    category: "STANDARD",
    example: "2021-01-01-2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "STANDARD",
    example: "12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "STANDARD",
    example: "2021-01-01 12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "STANDARD",
    example: "2021-01-01 12:00:00 UTC",
  },
  // european
  {
    format: "dd/MM/yyyy",
    temporalType: "DATE",
    category: "EUROPEAN",
    example: "01/01/2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "EUROPEAN",
    example: "12:00:00",
  },
  {
    format: "dd/MM/yyyy HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "EUROPEAN",
    example: "01/01/2021 12:00:00",
  },
  {
    format: "dd/MM/yyyy HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "EUROPEAN",
    example: "01/01/2021 12:00:00 UTC",
  },
  // american
  {
    format: "MM/dd/yyyy",
    temporalType: "DATE",
    category: "AMERICAN",
    example: "01/01/2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "AMERICAN",
    example: "12:00:00",
  },
  {
    format: "MM/dd/yyyy HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "AMERICAN",
    example: "01/01/2021 12:00:00",
  },
  {
    format: "MM/dd/yyyy HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "AMERICAN",
    example: "01/01/2021 12:00:00 UTC",
  },
  // recent - the DATE_TIME example is intentionally missing.
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "RECENT",
    example: "12:00:00",
  },
  {
    format: "yyyy-MM-dd",
    temporalType: "DATE",
    category: "RECENT",
    example: "2021-01-01 12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "RECENT",
    example: "2021-01-01 12:00:00 UTC",
  },
];

type DoMountParamsType = {
  allDefaultFormats?: FormatWithExample[];
  disabled?: boolean;
  compact?: boolean;
  isValid?: boolean;
  allowedFormats?: FormatDateType[];
  showPopupInitially?: boolean;
  initialFormatOption?: FormatDateType;
  initialCategoryOption?: FormatCategory;
};
export const doMount = async ({
  allDefaultFormats = DEFAULT_FORMATS,
  disabled = false,
  compact = false,
  isValid = true,
  allowedFormats = ["DATE", "TIME", "DATE_TIME", "ZONED_DATE_TIME"],
  showPopupInitially = false,
}: DoMountParamsType = {}) => {
  const wrapper = mount(DateTimeFormatInput, {
    props: {
      allDefaultFormats,
      disabled,
      compact,
      isValid,
      allowedTypes: allowedFormats,
    },
    attachTo: "body",
  });

  if (showPopupInitially) {
    await wrapper.find(".trigger-popover-button").trigger("click");
    expect(wrapper.find(".popover").exists()).toBeTruthy();
  }

  await nextTick();

  return { wrapper };
};

type PopoverAssertion = {
  numberOfFormats: (number: number) => void;
  formatsAvailable: (expectFormats: boolean) => void;
  isOpen: () => void;
  isClosed: () => void;
  isFirstFormat: (expectedFormat: string) => void;
  isSelected: (index: 0 | 1) => void;
  isInputValue: (expectedValue: string) => void;
};

type PopoverControl = {
  element: DOMWrapper<Element>;
  popoverButton: () => Promise<void>;
  clickAway: () => Promise<void>;
  apply: () => Promise<void>;
  updateFormat: (format: FormatDateType) => Promise<void>;
  updateCategory: (category: FormatCategory) => Promise<void>;
  arrowDown: () => Promise<void>;
  arrowUp: () => Promise<void>;
  enter: () => Promise<void>;
  selectFormat: (index: 0 | 1) => Promise<void>;
  doubleClickFirstFormat: () => Promise<void>;
  assert: PopoverAssertion;
};

export const doMountWithPopover = async (
  initialFormatOption: FormatDateType = "DATE",
  initialCategoryOption: FormatCategory = "RECENT",
): Promise<PopoverControl> => {
  const { wrapper } = await doMount({
    showPopupInitially: true,
  });

  const [formatSwitch, categorySwitch] = wrapper.findAllComponents(ValueSwitch);
  formatSwitch.vm.$emit("update:modelValue", initialFormatOption);
  categorySwitch.vm.$emit("update:modelValue", initialCategoryOption);

  const assert: PopoverAssertion = {
    numberOfFormats: (number: number) => {
      expect(
        wrapper.findAll(".single-format").length,
        `Expected test data to have length ${number}`,
      ).toBe(number);
    },
    formatsAvailable: (expectFormats: boolean) => {
      if (expectFormats) {
        expect(wrapper.find(".no-formats-available").exists()).toBeFalsy();
      } else {
        expect(wrapper.find(".no-formats-available").exists()).toBeTruthy();
      }
    },
    isOpen: () => {
      expect(wrapper.find(".popover").exists()).toBeTruthy();
      expect(wrapper.find(".popover").isVisible()).toBeTruthy();
    },
    isClosed: () => {
      expect(wrapper.find(".popover").exists()).toBeFalsy();
    },
    isFirstFormat: (expectedFormat: string) => {
      expect(wrapper.findAll(".format-pattern")[0].text()).toBe(expectedFormat);
    },
    isInputValue: (expectedValue: string) => {
      expect(wrapper.find("input").element.value).toBe(expectedValue);
    },
    isSelected: (index: 0 | 1) => {
      const allFormats = wrapper.findAll(".single-format");
      expect(allFormats[index].classes()).toContain("selected");
    },
  };

  return {
    element: wrapper.find(".popover"),
    clickAway: async () => {
      await wrapper.trigger("click");
    },
    popoverButton: async () => {
      await wrapper.find(".trigger-popover-button").trigger("click");
    },
    apply: async () => {
      await wrapper.find(".commit-button").trigger("click");
    },
    updateFormat: async (format: FormatDateType) => {
      formatSwitch.vm.$emit("update:modelValue", format);
      await nextTick();
    },
    updateCategory: async (category: FormatCategory) => {
      categorySwitch.vm.$emit("update:modelValue", category);
      await nextTick();
    },
    assert,
    arrowDown: async () => {
      await wrapper
        .find(".formats-container")
        .trigger("keydown", { key: "ArrowDown" });
      await nextTick();
    },
    arrowUp: async () => {
      await wrapper
        .find(".formats-container")
        .trigger("keydown", { key: "ArrowUp" });
      await nextTick();
    },
    selectFormat: async (index: 0 | 1) => {
      const allFormats = wrapper.findAll(".single-format");
      if (allFormats.length <= index) {
        throw new Error(
          `selectFormat: Index out of bounds. ${index} >= ${allFormats.length}`,
        );
      }
      await allFormats[index].trigger("click");
    },
    enter: async () => {
      await wrapper
        .find(".formats-container")
        .trigger("keydown", { key: "Enter" });
    },
    doubleClickFirstFormat: async () => {
      await wrapper.findAll(".single-format")[0].trigger("dblclick");
    },
  };
};

export const getFirstFormat = (
  type: FormatDateType,
  category: FormatCategory,
): string => {
  const firstFormat = DEFAULT_FORMATS.find(
    (format) => format.temporalType === type && format.category === category,
  );
  // eslint-disable-next-line no-undefined
  if (firstFormat === undefined) {
    throw new Error("No formats available for the given type and category");
  }
  return firstFormat!.format;
};
