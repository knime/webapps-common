import { mockRegisterSettings } from "@@/test-setup/utils/integration/dirtySettingState";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  dialogWithTextInputData,
  mountNodeDialog,
  setInitialData,
} from "./loadingDialogTestUtils";

describe("handling of asynchronous dialog components", () => {
  beforeEach(() => {
    mockRegisterSettings();
    vi.useFakeTimers();
    setInitialData(dialogWithTextInputData);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show the loading dialog if it takes a while to fetch", async () => {
    const wrapper = await mountNodeDialog();
    await vi.runOnlyPendingTimers();
    expect(wrapper.find(".skeleton").exists()).toBeTruthy();
  });
});
