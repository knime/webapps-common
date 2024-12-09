import { beforeEach, describe, expect, it, vi } from "vitest";

import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import DateTimeFormatInput from "../DateTimeFormatInput.vue";
import type { FormatCategory, FormatDateType } from "../utils/types";

import {
  doMount,
  doMountWithPopover,
  getFirstFormat,
} from "./DateTimeFormatInputTestUtils";

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
    await input.setValue("xyz");
    await input.trigger("input");

    expect(formatValidator).toHaveBeenCalledWith("xyz");
  });

  it("displays invalid marker for invalid input", async () => {
    const { wrapper } = await doMount({
      formatValidator: () => false,
    });

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

  it("has DATE and RECENT as default selected options", async () => {
    const { wrapper } = await doMount({
      showPopupInitially: true,
    });

    const valueSwitches = wrapper.findAllComponents(ValueSwitch);

    expect(valueSwitches[0].vm.$props.modelValue).toBe("DATE");
    expect(valueSwitches[1].vm.$props.modelValue).toBe("RECENT");
  });

  describe("dateTimeFormatPickerPopover", () => {
    beforeEach(() => {
      window.HTMLElement.prototype.scrollIntoView = vi.fn(() => {});
    });

    it("closes the popover when clicking away and displays the popover on button click", async () => {
      const popover = await doMountWithPopover();
      popover.assert.isOpen();

      await popover.clickAway();
      popover.assert.isClosed();

      await popover.popoverButton();
      popover.assert.isOpen();
    });

    it("closes the popover on a second button click", async () => {
      const popover = await doMountWithPopover();
      popover.assert.isOpen();

      await popover.popoverButton();

      popover.assert.isClosed();
    });

    it("respects the allowedFormats prop", async () => {
      const allowedFormats = ["DATE", "DATE_TIME", "TIME"] as FormatDateType[];

      const { wrapper } = await doMount({
        allowedFormats,
        showPopupInitially: true,
      });

      const [temporalValueSwitch] = wrapper.findAllComponents(ValueSwitch);

      expect(temporalValueSwitch.vm.$props.possibleValues?.length).toBe(
        allowedFormats.length,
      );
    });

    it("changes what's displayed when changing the temporal type value switch", async () => {
      const firstOption: FormatDateType = "TIME";
      const category: FormatCategory = "STANDARD";
      const popover = await doMountWithPopover(firstOption, category);

      popover.assert.isFirstFormat(getFirstFormat(firstOption, category));

      const secondOption: FormatDateType = "DATE";
      await popover.updateFormat(secondOption);

      popover.assert.isFirstFormat(getFirstFormat(secondOption, category));
    });

    it("changes what's displayed when changing the category value switch", async () => {
      const popover = await doMountWithPopover("DATE", "EUROPEAN");

      popover.assert.isFirstFormat(getFirstFormat("DATE", "EUROPEAN"));

      await popover.updateCategory("STANDARD");

      popover.assert.isFirstFormat(getFirstFormat("DATE", "STANDARD"));
    });

    it("clicking a format marks it as selected", async () => {
      const popover = await doMountWithPopover();

      await popover.selectFormat(0);

      popover.assert.isSelected(0);
    });

    it("responds to up/down arrow keys", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");
      popover.assert.numberOfFormats(2);
      await popover.selectFormat(0);
      popover.assert.isSelected(0);

      await popover.arrowDown();
      popover.assert.isSelected(1);

      // should loop so one more should bring us back to the top
      await popover.arrowDown();
      popover.assert.isSelected(0);

      // Should also work with arrow up - this time we start with the loop
      await popover.keyUp();
      popover.assert.isSelected(1);

      await popover.keyUp();
      popover.assert.isSelected(0);
    });

    it("scrolls when using arrow keys to select something", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");
      popover.assert.numberOfFormats(2);
      await popover.selectFormat(0);

      expect(
        window.HTMLElement.prototype.scrollIntoView,
      ).toHaveBeenCalledOnce();

      await popover.arrowDown();
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
        2,
      );

      await popover.keyUp();
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledTimes(
        3,
      );
    });

    it("commits the selected format when pressing enter", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");
      popover.assert.numberOfFormats(2);

      await popover.selectFormat(0);
      await popover.enter();

      popover.assert.isClosed();
      popover.assert.isInputValue(getFirstFormat("DATE", "STANDARD"));
    });

    it("commits a format on double-click", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");
      popover.assert.numberOfFormats(2);

      await popover.doubleClickFirstFormat();

      popover.assert.isClosed();
      popover.assert.isInputValue(getFirstFormat("DATE", "STANDARD"));
    });

    it("apply button is disabled if nothing is selected", async () => {
      const popover = await doMountWithPopover();

      const applyButton = popover.element.find(".commit-button");
      expect(applyButton.classes()).toContain("disabled");

      await popover.selectFormat(0);
      expect(applyButton.classes()).not.toContain("disabled");
    });

    it("clicking apply should close the popover and set the text field", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");

      await popover.selectFormat(0);
      await popover.apply();

      popover.assert.isClosed();
      popover.assert.isInputValue(getFirstFormat("DATE", "STANDARD"));
    });

    it("shows a friendly error if there are no formats to display", async () => {
      // Note: we have no formats under DATE_TIME and RECENT
      const popover = await doMountWithPopover("DATE_TIME", "RECENT");

      expect(() => getFirstFormat("DATE_TIME", "RECENT")).toThrowError();
      popover.assert.formatsAvailable(false);

      // but if we set the value switches to something else, we shouldn't see this any more
      await popover.updateFormat("DATE");
      await popover.updateCategory("STANDARD");

      popover.assert.formatsAvailable(true);
      await popover.selectFormat(0);
    });
  });
});
