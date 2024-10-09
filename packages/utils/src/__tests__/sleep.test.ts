import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import sleep from "../sleep";

describe("sleep", () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("resolves after ms", async () => {
    let sleepFinished = false;
    sleep(2000).then(() => {
      sleepFinished = true;
    });

    expect(sleepFinished).toBe(false);

    vi.advanceTimersByTime(1000);
    await flushPromises();
    expect(sleepFinished).toBe(false);

    vi.advanceTimersByTime(1000);
    await flushPromises();
    expect(sleepFinished).toBe(true);
  });
});
