import { describe, expect, it, vi } from "vitest";

import { retryPromise } from "../retryPromise";

describe("retryPromise", () => {
  it("should retry", async () => {
    let callCount = 0;
    const mockFetchCall = vi.fn(
      () =>
        new Promise((resolve, reject) => {
          callCount++;

          if (callCount < 3) {
            reject(new Error("failure"));
            return;
          }

          if (callCount >= 3) {
            resolve("success");
          }
        }),
    );

    const doneSpy = vi.fn();
    const catchSpy = vi.fn();

    const promise = retryPromise({ fn: () => mockFetchCall() })
      .then(doneSpy)
      .catch(catchSpy);

    await promise;

    expect(doneSpy).toHaveBeenCalledOnce();
    expect(catchSpy).not.toHaveBeenCalled();
    expect(mockFetchCall).toHaveBeenCalledTimes(3);
  });

  it("should throw if retry count is exceeded", async () => {
    const error = new Error("failure");
    const mockFetchCall = vi.fn(() => Promise.reject(error));

    const doneSpy = vi.fn();

    const promise = retryPromise({ fn: () => mockFetchCall() }).then(doneSpy);

    await promise.catch(() => {}); // ignore errors caught by test
    await expect(() => promise).rejects.toThrowError(error);

    expect(doneSpy).not.toHaveBeenCalled();
    expect(mockFetchCall).toHaveBeenCalledTimes(6);
  });

  it("should not retry for specific errors", async () => {
    class MyError extends Error {}
    const myError = new MyError("failure");
    const mockFetchCall = vi.fn(() => Promise.reject(myError));

    const doneSpy = vi.fn();

    const promise = retryPromise({
      fn: () => mockFetchCall(),
      retryCount: 2,
      retryDelayMS: 0,
      excludeError: (e) => e instanceof MyError,
    }).then(doneSpy);

    await promise.catch(() => {}); // ignore errors caught by test
    await expect(() => promise).rejects.toThrowError(myError);

    expect(doneSpy).not.toHaveBeenCalled();
    expect(mockFetchCall).toHaveBeenCalledOnce();
  });
});
