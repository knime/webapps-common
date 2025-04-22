/* eslint-disable vitest/expect-expect */
import { beforeEach, describe, expect, it, vi } from "vitest";

import ValueSwitch from "../../ValueSwitch/ValueSwitch.vue";
import DateTimeFormatInput from "../DateTimeFormatInput.vue";
import type { FormatCategory, FormatDateType } from "../utils/types";

import {
  doMount,
  doMountWithPopover,
  getFirstFormat,
} from "./DateTimeFormatInputTestUtils";

// This component is EXTREMELY broken in test environments,
// so we just replace with its children.
vi.mock("focus-trap-vue", () => ({
  FocusTrap: {
    template: "<template><slot /></template>",
  },
}));

describe("DateTimeFormatInput", () => {
  beforeEach(() => {
    // mock scrollIntoView so it doesn't crash in tests
    window.HTMLElement.prototype.scrollIntoView = vi.fn(() => {});
  });

  it("renders", async () => {
    const { wrapper } = await doMount();
    expect(wrapper.findComponent(DateTimeFormatInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(DateTimeFormatInput).isVisible()).toBeTruthy();
  });

  it("displays invalid marker for invalid input", async () => {
    const { wrapper } = await doMount({
      isValid: false,
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

    it("commits a format on click", async () => {
      const popover = await doMountWithPopover("DATE", "STANDARD");
      popover.assert.numberOfFormats(2);

      await popover.clickFirstFormat();

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
