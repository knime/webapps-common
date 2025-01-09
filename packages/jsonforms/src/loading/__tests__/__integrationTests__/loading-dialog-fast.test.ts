import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mountJsonFormsDialog } from "./loadingDialogTestUtils";

describe("handling of asynchronous dialog components", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not show the loading dialog if it is fetched quickly", async () => {
    const wrapper = mountJsonFormsDialog();
    await vi.dynamicImportSettled();
    await vi.runOnlyPendingTimers();
    expect(wrapper.find(".skeleton").exists()).toBeFalsy();
  });
});
