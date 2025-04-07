import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { computed, nextTick, ref } from "vue";

import { useAutoCloseOnCompletion } from "../useAutoCloseOnCompletion";

describe("useAutoCloseOnCompletion", () => {
  const setup = () => {
    const items = ref([{ status: "not-ready" }]);
    const close = vi.fn();
    return {
      items,
      close,
    };
  };

  beforeAll(() => {
    vi.useFakeTimers();
  });

  beforeEach(() => {
    vi.clearAllTimers();
  });

  it("calls close callback on completion", async () => {
    const { items, close } = setup();
    useAutoCloseOnCompletion({
      items: computed(() => items.value),
      close,
      completedStatus: "ready",
    });
    items.value[0].status = "ready";
    // one tick for the change to be detected, one tick for watcher
    await nextTick();
    await nextTick();
    vi.runAllTimers();
    expect(close).toHaveBeenCalled();
  });

  it("does not call close callback if not all items completed", async () => {
    const { items, close } = setup();
    items.value.push({ status: "not-ready" });
    useAutoCloseOnCompletion({
      items: computed(() => items.value),
      close,
      completedStatus: "ready",
    });
    items.value[0].status = "ready";
    // one tick for the change to be detected, one tick for watcher
    await nextTick();
    await nextTick();
    vi.runAllTimers();
    expect(close).not.toHaveBeenCalled();
  });

  it("will not close if items are changed", async () => {
    const { items, close } = setup();
    useAutoCloseOnCompletion({
      items: computed(() => items.value),
      close,
      completedStatus: "ready",
    });
    items.value[0].status = "ready";
    // one tick for the change to be detected, one tick for watcher
    await nextTick();
    await nextTick();
    vi.advanceTimersByTime(5000);

    items.value[0].status = "not-ready";
    await nextTick();
    await nextTick();
    vi.runAllTimers();

    expect(close).not.toHaveBeenCalled();
  });
});
