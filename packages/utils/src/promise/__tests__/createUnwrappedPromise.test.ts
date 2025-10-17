/* eslint-disable @typescript-eslint/no-floating-promises */
import { describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { createUnwrappedPromise } from "../createUnwrappedPromise";

describe("createUnwrappedPromise", () => {
  it("resolves", async () => {
    const { promise, resolve } = createUnwrappedPromise();

    const done = vi.fn();
    promise.then(done);
    await flushPromises();

    expect(done).not.toHaveBeenCalled();
    resolve("foo");
    await flushPromises();
    expect(done).toHaveBeenCalledWith("foo");
  });

  it("rejects", async () => {
    const { promise, reject } = createUnwrappedPromise();
    const done = vi.fn();
    promise.catch(done);

    await flushPromises();
    expect(done).not.toHaveBeenCalled();

    const error = new Error("foo");
    reject(error);

    await flushPromises();
    expect(done).toHaveBeenCalledWith(error);
  });
});
