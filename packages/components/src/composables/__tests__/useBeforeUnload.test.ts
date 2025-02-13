import { describe, expect, it, vi } from "vitest";

import mountComposable from "../hints/composables/__tests__/mountComposable";
import { useBeforeUnload } from "../useBeforeUnload";

describe("useBeforeUnload", () => {
  it("should trigger when has unsaved changes", () => {
    const { lifeCycle } = mountComposable({
      composable: useBeforeUnload,
      composableProps: {
        hasUnsavedChanges: () => true,
      },
    });

    const preventDefault = vi.fn();
    window.Event.prototype.preventDefault = preventDefault;

    window.dispatchEvent(new Event("beforeunload"));
    expect(preventDefault).toHaveBeenCalled();

    lifeCycle.unmount();
  });

  it("should not trigger when does not have unsaved changes", () => {
    const { lifeCycle } = mountComposable({
      composable: useBeforeUnload,
      composableProps: {
        hasUnsavedChanges: () => false,
      },
    });

    const preventDefault = vi.fn();
    window.Event.prototype.preventDefault = preventDefault;

    window.dispatchEvent(new Event("beforeunload"));
    expect(preventDefault).not.toHaveBeenCalled();

    lifeCycle.unmount();
  });

  it("should not trigger after unmount", () => {
    const { lifeCycle } = mountComposable({
      composable: useBeforeUnload,
      composableProps: {
        hasUnsavedChanges: () => false,
      },
    });
    lifeCycle.unmount();

    const preventDefault = vi.fn();
    window.Event.prototype.preventDefault = preventDefault;

    window.dispatchEvent(new Event("beforeunload"));
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
