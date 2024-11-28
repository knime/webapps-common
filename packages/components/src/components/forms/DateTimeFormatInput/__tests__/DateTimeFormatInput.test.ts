import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import DateTimeFormatInput from "../DateTimeFormatInput.vue";
import type { FormatDateType, FormatWithExample } from "../utils/types";

import { DEFAULT_FORMATS } from "./testData";

type DoMountParamsType = {
  allDefaultFormats?: FormatWithExample[];
  disabled?: boolean;
  compact?: boolean;
  allowedFormats?: FormatDateType[];
  formatValidator?: (format: string) => boolean;
  showPopupInitially?: boolean;
};
const doMount = async ({
  allDefaultFormats = DEFAULT_FORMATS,
  disabled = false,
  compact = false,
  allowedFormats = ["DATE", "TIME", "DATE_TIME", "ZONED_DATE_TIME"],
  formatValidator = () => true,
  showPopupInitially = false,
}: DoMountParamsType = {}) => {
  const wrapper = mount(DateTimeFormatInput, {
    props: {
      allDefaultFormats,
      disabled,
      compact,
      allowedFormats,
      formatValidator,
    },
    attachTo: "body",
  });

  if (showPopupInitially) {
    await wrapper.find(".trigger-popover-button").trigger("click");
    expect(wrapper.find(".popover").exists()).toBeTruthy();
  }

  return {
    wrapper,
  };
};

describe("DateTimeFormatInput", () => {
  it("renders", async () => {
    const { wrapper } = await doMount();
    expect(wrapper.findComponent(DateTimeFormatInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(DateTimeFormatInput).isVisible()).toBeTruthy();
  });

  it("uses the validator", async () => {
    const formatValidator = vi.fn((format) => format === "yyyy-MM-dd");

    const { wrapper } = await doMount({
      formatValidator,
    });

    const input = wrapper.find("input");
    input.setValue("xyz");
    await input.trigger("input");

    expect(formatValidator).toHaveBeenCalledWith("xyz");
  });

  it("displays invalid marker for invalid input", async () => {
    const { wrapper } = await doMount({
      formatValidator: () => false,
    });

    await nextTick();

    expect(wrapper.find(".invalid-marker").exists()).toBeTruthy();
  });

  it("is disabled if disabled prop is set", async () => {
    const { wrapper } = await doMount({
      disabled: true,
    });

    expect(wrapper.find(".wrapper").classes()).toContain("disabled");
  });

  it("is compact if compact prop is set", async () => {
    const { wrapper } = await doMount({
      compact: true,
    });

    expect(wrapper.find(".wrapper").classes()).toContain("compact");
  });

  it("displays the popover on button click", async () => {
    const { wrapper } = await doMount();

    expect(wrapper.find(".popover").exists()).toBeFalsy();

    const button = wrapper.find(".trigger-popover-button");
    await button.trigger("click");

    expect(wrapper.find(".popover").exists()).toBeTruthy();
  });

  it("closes the popover on a second button click", async () => {
    const { wrapper } = await doMount({
      showPopupInitially: true,
    });

    const button = wrapper.find(".trigger-popover-button");
    await button.trigger("click");

    expect(wrapper.find(".popover").exists()).toBeFalsy();
  });

  it("closes the popover when clicking away", async () => {
    const { wrapper } = await doMount({
      showPopupInitially: true,
    });

    await wrapper.trigger("click");

    expect(wrapper.find(".popover").exists()).toBeFalsy();
  });

  describe("dateTimeFormatPickerPopover", () => {
    beforeEach(() => {
      window.HTMLElement.prototype.scrollIntoView = vi.fn(() => {});
    });

    it("respects the allowedFormats prop", async () => {
      const { wrapper } = await doMount({
        allowedFormats: ["DATE", "DATE_TIME", "TIME"],
        showPopupInitially: true,
      });

      const temporalValueSwitch = wrapper.findAllComponents(ValueSwitch)[0];

      expect(temporalValueSwitch.vm.$props.possibleValues?.length).toBe(3);
    });

    it("changes what's displayed when changing the temporal type value switch", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const temporalValueSwitch = wrapper.findAllComponents(ValueSwitch)[0];

      temporalValueSwitch.vm.$emit("update:modelValue", "TIME");
      await nextTick();

      expect(wrapper.findAll(".format-pattern")[0].text()).toBe("HH:mm:ss");

      temporalValueSwitch.vm.$emit("update:modelValue", "DATE");
      await nextTick();

      expect(wrapper.findAll(".format-pattern")[0].text()).toBe("yyyy-MM-dd");
    });

    it("changes what's displayed when changing the category value switch", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const categoryValueSwitch = wrapper.findAllComponents(ValueSwitch)[1];

      categoryValueSwitch.vm.$emit("update:modelValue", "EUROPEAN");
      await nextTick();

      expect(wrapper.findAll(".format-pattern")[0].text()).toBe("dd/MM/yyyy");

      categoryValueSwitch.vm.$emit("update:modelValue", "AMERICAN");
      await nextTick();

      expect(wrapper.findAll(".format-pattern")[0].text()).toBe("MM/dd/yyyy");
    });

    it("clicking a format marks it as selected", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const format = wrapper.findAll(".single-format")[0];
      await format.trigger("click");

      expect(format.classes()).toContain("selected");
    });

    it("has DATE and RECENT as default selected options", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const valueSwitches = wrapper.findAllComponents(ValueSwitch);

      expect(valueSwitches[0].vm.$props.modelValue).toBe("DATE");
      expect(valueSwitches[1].vm.$props.modelValue).toBe("RECENT");
    });

    it("responds to up/down arrow keys", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      // select STANDARD and DATE
      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      const popover = wrapper.find(".popover");
      const formatsContainer = popover.find(".formats-container");

      const allFormats = wrapper.findAll(".single-format");

      expect(allFormats.length, "Expected test data to have length 2").toBe(2);

      await allFormats[0].trigger("click"); // select first one

      expect(allFormats[0].classes()).toContain("selected");
      expect(allFormats[1].classes()).not.toContain("selected");

      await formatsContainer.trigger("keydown", { key: "ArrowDown" });
      await nextTick();

      expect(allFormats[0].classes()).not.toContain("selected");
      expect(allFormats[1].classes()).toContain("selected");

      // should loop so one more should bring us back to the top
      await formatsContainer.trigger("keydown", { key: "ArrowDown" });
      await nextTick();

      expect(allFormats[0].classes()).toContain("selected");
      expect(allFormats[1].classes()).not.toContain("selected");

      // Should also work with arrow up - this time we start with the loop
      await formatsContainer.trigger("keydown", { key: "ArrowUp" });
      await nextTick();

      expect(allFormats[0].classes()).not.toContain("selected");
      expect(allFormats[1].classes()).toContain("selected");

      await formatsContainer.trigger("keydown", { key: "ArrowUp" });
      await nextTick();

      expect(allFormats[0].classes()).toContain("selected");
      expect(allFormats[1].classes()).not.toContain("selected");
    });

    it("scrolls when using arrow keys to select something", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      // select STANDARD and DATE
      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      const popover = wrapper.find(".popover");
      const formatsContainer = popover.find(".formats-container");

      const allFormats = wrapper.findAll(".single-format");

      expect(allFormats.length, "Expected test data to have length 2").toBe(2);

      await allFormats[0].trigger("click"); // select first one

      expect(
        window.HTMLElement.prototype.scrollIntoView,
      ).toHaveBeenCalledOnce(); // clicking also calls it

      await formatsContainer.trigger("keydown", { key: "ArrowDown" });

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
        2,
      );

      await formatsContainer.trigger("keydown", { key: "ArrowUp" });

      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
        3,
      );
    });

    it("commits the selected format when pressing enter", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const popover = wrapper.find(".popover");
      const formatsContainer = popover.find(".formats-container");

      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      const allFormats = wrapper.findAll(".single-format");

      expect(allFormats.length, "Expected test data to have length 2").toBe(2);

      await allFormats[0].trigger("click"); // select first one

      await formatsContainer.trigger("keydown", { key: "Enter" });

      await nextTick();

      expect(wrapper.find(".popover").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toBe(
        "yyyy-MM-dd-blahblahblah",
      );
    });

    it("commits a format on double-click", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      const allFormats = wrapper.findAll(".single-format");

      expect(allFormats.length, "Expected test data to have length 2").toBe(2);

      await allFormats[0].trigger("dblclick");

      await nextTick();

      expect(wrapper.find(".popover").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toBe(
        "yyyy-MM-dd-blahblahblah",
      );
    });

    it("apply button is disabled if nothing is selected", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const applyButton = wrapper.find(".commit-button");

      expect(applyButton.classes()).toContain("disabled");

      // now select something
      await wrapper.findAll(".single-format")[0].trigger("click");

      expect(applyButton.classes()).not.toContain("disabled");
    });

    it("clicking apply should close the popover and set the text field", async () => {
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      // set the value switches to DATE and STANDARD
      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      const applyButton = wrapper.find(".commit-button");

      await wrapper.findAll(".single-format")[0].trigger("click");
      await applyButton.trigger("click");

      expect(wrapper.find(".popover").exists()).toBeFalsy();
      expect(wrapper.find("input").element.value).toBe(
        "yyyy-MM-dd-blahblahblah",
      );
    });

    it("shows a friendly error if there are no formats to display", async () => {
      // Note: we have no formats under DATE_TIME and RECENT
      const { wrapper } = await doMount({
        showPopupInitially: true,
      });

      const valueSwitches = wrapper.findAllComponents(ValueSwitch);
      valueSwitches[0].vm.$emit("update:modelValue", "DATE_TIME");
      valueSwitches[1].vm.$emit("update:modelValue", "RECENT");

      await nextTick();

      expect(wrapper.find(".single-format").exists()).toBeFalsy();
      expect(wrapper.find(".no-formats-available").exists()).toBeTruthy();

      // but if we set the value switches to something else, we shouldn't see this any more
      valueSwitches[0].vm.$emit("update:modelValue", "TIME");
      valueSwitches[1].vm.$emit("update:modelValue", "STANDARD");

      await nextTick();

      expect(wrapper.find(".single-format").exists()).toBeTruthy();
      expect(wrapper.find(".no-formats-available").exists()).toBeFalsy();
    });
  });
});
