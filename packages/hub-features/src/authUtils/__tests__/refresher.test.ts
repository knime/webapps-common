import { type Mock, afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import { startRefresher } from "../refresher";
import { AUTH_SERVICE_PATH } from "../shared";

describe("startRefresher", () => {
  const setMocks = ({
    fetchFailed = false,
    timeoutId = Math.random(),
  } = {}) => {
    const mockSetTimeout = vi.fn().mockReturnValue(timeoutId);
    const mockClearTimeout = vi.fn();
    const mockFetch = vi.fn();
    if (fetchFailed) {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });
    } else {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ expiry: 60 }),
      });
    }
    global.fetch = mockFetch;
    global.setTimeout = mockSetTimeout as Mock & { __promisify__: any };
    global.clearTimeout = mockClearTimeout;

    return { mockSetTimeout, mockClearTimeout, mockFetch };
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clears existing timeout when called", async () => {
    const firstTimeoutId = Math.random();
    const { mockClearTimeout } = setMocks({ timeoutId: firstTimeoutId });
    startRefresher();
    await flushPromises();
    startRefresher();
    expect(mockClearTimeout).toHaveBeenCalledWith(firstTimeoutId);
  });

  it("calls fetch with the correct endpoint", () => {
    const { mockFetch } = setMocks();
    const fetchPath = `${AUTH_SERVICE_PATH}/refresh`;
    startRefresher();
    expect(mockFetch).toHaveBeenCalledWith(fetchPath);
  });

  it("throws an error if fetch request fails", () => {
    vi.spyOn(consola, "warn").mockImplementationOnce(() => {});
    setMocks({ fetchFailed: true });

    try {
      startRefresher();
    } catch (error: any) {
      // eslint-disable-next-line vitest/no-conditional-expect
      expect(error).toBeInstanceOf(Error);

      // eslint-disable-next-line vitest/no-conditional-expect
      expect(error.message).toBe("Error during auth refresh: 500");
    }
  });
});
