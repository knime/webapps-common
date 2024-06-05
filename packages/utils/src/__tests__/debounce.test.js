/* eslint-disable no-magic-numbers */
import { describe, it, expect, vi } from "vitest";

import debounce from "../debounce";

vi.useFakeTimers();

describe("debounce", () => {
  let method = vi.fn();

  it("debounces many calls to a few", () => {
    const debouncedMethod = debounce(method, 100);

    debouncedMethod();
    debouncedMethod();
    debouncedMethod();
    debouncedMethod();

    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10);
    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(20);
    expect(method).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(300);
    expect(method).toHaveBeenCalledTimes(2);
  });
});
