/* eslint-disable no-magic-numbers */
import { describe, expect, it, vi } from "vitest";

import debounce from "../debounce";

vi.useFakeTimers();

describe("debounce", () => {
  const method = vi.fn();

  it("debounces many calls to a few", () => {
    const debouncedMethod = debounce(method, 100);

    debouncedMethod("", 0);
    debouncedMethod("", 0);
    debouncedMethod("", 0);
    debouncedMethod("", 0);

    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(20);
    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    expect(method).toHaveBeenCalledTimes(2);
  });
});
