import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mountJsonFormsDialog } from "./loadingDialogTestUtils";

describe("handling of asynchronous dialog components", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show the loading dialog if it takes a while to fetch", async () => {
    const wrapper = mountJsonFormsDialog();
    await vi.runOnlyPendingTimers();
    expect(wrapper.find(".skeleton").exists()).toBeTruthy();
  });
});
