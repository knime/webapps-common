import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockRegisterSettings } from "../../../../test-setup/utils/integration/dirtySettingState";

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

  it("should not show the loading dialog if it is fetched quickly", async () => {
    const wrapper = await mountNodeDialog();
    await vi.dynamicImportSettled();
    await vi.runOnlyPendingTimers();
    expect(wrapper.find(".skeleton").exists()).toBeFalsy();
  });
});
