/* eslint-disable @typescript-eslint/no-floating-promises */
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import * as guest from "../guest";
import { MESSAGES } from "../messages";

vi.mock("consola");

describe("Embedding SDK::GUEST", () => {
  beforeAll(() => {
    import.meta.env.DEV = false;
  });

  afterEach(() => {
    guest.clearContext();
    vi.clearAllMocks();
  });

  const createWindowMessage = (data: any) =>
    new MessageEvent("message", { data });

  const postMessage = vi.spyOn(window.parent, "postMessage");

  describe("waitForContext", () => {
    it("waits for the correct message", async () => {
      const done = vi.fn();
      guest.waitForContext().then(done);

      await flushPromises();
      expect(done).not.toHaveBeenCalled();

      // send bogus message
      window.dispatchEvent(createWindowMessage("foo"));
      await flushPromises();
      expect(done).not.toHaveBeenCalled();

      window.dispatchEvent(
        createWindowMessage({
          type: MESSAGES.EMBEDDING_CONTEXT,
          payload: {
            url: "ws://foo.com",
            restApiBaseUrl: "/api",
            userIdleTimeout: 1000,
          },
        }),
      );

      await flushPromises();
      expect(done).toHaveBeenCalledExactlyOnceWith({
        url: "ws://foo.com",
        restApiBaseUrl: "/api",
        userIdleTimeout: 1000,
      });
    });

    it("uses a validator (SUCCESS)", async () => {
      const validator = vi.fn(() => ({ valid: true, error: null }) as const);
      const promise = guest.waitForContext(validator);

      window.dispatchEvent(
        createWindowMessage({
          type: MESSAGES.EMBEDDING_CONTEXT,
          payload: { foo: "bar" },
        }),
      );

      await expect(promise).resolves.toEqual({ foo: "bar" });
    });

    it("uses a validator (FAILURE)", async () => {
      await expect(() => {
        const validator = vi.fn(
          () => ({ valid: false, error: "some error" }) as const,
        );
        const promise = guest.waitForContext(validator);

        window.dispatchEvent(
          createWindowMessage({
            type: MESSAGES.EMBEDDING_CONTEXT,
            payload: {},
          }),
        );

        return promise;
      }).rejects.toThrowError(new Error("some error"));
    });

    it("sends message to notify that context can be sent", () => {
      guest.waitForContext();
      expect(postMessage).toHaveBeenCalledExactlyOnceWith(
        { type: MESSAGES.AWAITING_EMBEDDING_CONTEXT },
        "*",
      );
    });
  });

  it("notifies user activity", () => {
    const payload = { idle: true, lastActive: new Date().toISOString() };

    guest.notifyActivityChange(payload);
    expect(postMessage).toHaveBeenCalledExactlyOnceWith(
      { type: MESSAGES.USER_ACTIVITY, payload },
      "*",
    );
  });

  it("sends embedding failure message", () => {
    const error = new Error("boom!");
    guest.sendEmbeddingFailureMessage(error);

    expect(postMessage).toHaveBeenCalledExactlyOnceWith(
      { type: MESSAGES.EMBEDDING_FAILED, error },
      "*",
    );
  });

  it("can get the current embedding context", async () => {
    guest.waitForContext();

    expect(guest.getContext()).toBeUndefined();

    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.EMBEDDING_CONTEXT,
        payload: {
          url: "ws://foo.com",
          restApiBaseUrl: "/api",
          userIdleTimeout: 1000,
        },
      }),
    );

    await flushPromises();
    expect(guest.getContext()).toEqual({
      url: "ws://foo.com",
      restApiBaseUrl: "/api",
      userIdleTimeout: 1000,
    });
  });
});
