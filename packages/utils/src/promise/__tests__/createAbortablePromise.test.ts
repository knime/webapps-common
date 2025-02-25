import { describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { AbortError, createAbortablePromise } from "../createAbortablePromise";

describe("createAbortablePromise", () => {
  it("should abort promise", async () => {
    const mockFetchCall = () =>
      new Promise((r) => setTimeout(() => r("resolved-value"), 300));

    const { abortController, runAbortablePromise } = createAbortablePromise();

    const catchSpy = vi.fn((e) => {
      if (e instanceof AbortError) {
        return "aborted";
      }

      throw e;
    });

    const promise = runAbortablePromise(() => mockFetchCall()).catch(catchSpy);

    const abortError = new AbortError("aborting");
    abortController.abort(abortError);

    await flushPromises();

    expect(catchSpy).toHaveBeenCalledWith(abortError);
    await expect(promise).resolves.toBe("aborted");
  });
});
