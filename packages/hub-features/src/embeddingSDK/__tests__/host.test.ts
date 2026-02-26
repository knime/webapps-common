import { beforeAll, describe, expect, it, vi } from "vitest";

import * as host from "../host";
import { MESSAGES } from "../messages";

describe("Embedding SDK::HOST", () => {
  const createWindowMessage = (data: any) =>
    new MessageEvent("message", { data });

  beforeAll(() => {
    // mute consola
    const consola = {
      log: () => {},
      info: () => {},
      withTag: () => {},
      fatal: () => {},
      error: () => {},
      trace: () => {},
    };

    window.consola = {
      ...consola,
      // @ts-expect-error
      withTag: () => consola,
    };
  });

  describe("init", () => {
    it("listens to the correct message events", () => {
      const onReady = vi.fn();
      const onError = vi.fn();

      host.init({ onReady, onError });

      const createMessage = (data: any) =>
        new MessageEvent("message", { data });

      window.dispatchEvent(createMessage("foo"));

      expect(onReady).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();

      window.dispatchEvent(
        createMessage({ type: MESSAGES.AWAITING_EMBEDDING_CONTEXT }),
      );

      expect(onReady).toHaveBeenCalledOnce();
    });

    it("listens to ready messages only once", () => {
      const onReady = vi.fn();
      const onError = vi.fn();
      const messageData = { type: MESSAGES.AWAITING_EMBEDDING_CONTEXT };

      host.init({ onReady, onError });

      window.dispatchEvent(createWindowMessage(messageData));
      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(0);

      window.dispatchEvent(createWindowMessage(messageData));
      expect(onReady).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledTimes(0);
    });

    it("listens to error messages only once", () => {
      const onReady = vi.fn();
      const onError = vi.fn();
      const error = new Error("something wrong");
      const messageData = {
        type: MESSAGES.EMBEDDING_FAILED,
        error,
      };

      host.init({ onReady, onError });

      window.dispatchEvent(createWindowMessage(messageData));
      expect(onReady).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledExactlyOnceWith(error);

      window.dispatchEvent(createWindowMessage(messageData));
      expect(onReady).toHaveBeenCalledTimes(0);
      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledExactlyOnceWith(error);
    });
  });

  it("can send embedding context message", () => {
    const mockIframe = document.createElement("iframe");
    const postMessage = vi.fn();
    Object.defineProperty(mockIframe, "contentWindow", {
      value: { postMessage },
    });

    host.sendEmbeddingContext(mockIframe, "http://foo.com", {
      jobId: "jobId",
      restApiBaseUrl: "restApiBaseUrl",
      sessionId: "sessionId",
      wsConnectionUri: "wsConnectionUri",
      userIdleTimeout: 10_000,
      url: "wsConnectionUri",
    });

    expect(postMessage).toHaveBeenCalledWith(
      {
        type: MESSAGES.EMBEDDING_CONTEXT,
        payload: {
          wsConnectionUri: "wsConnectionUri",
          url: "wsConnectionUri",
          sessionId: "sessionId",
          jobId: "jobId",
          restApiBaseUrl: "restApiBaseUrl",
          userIdleTimeout: 10_000,
        },
      },
      "http://foo.com",
    );
  });

  it("listens to user activity events", () => {
    const onActivity = vi.fn();
    const removeListener = host.listenToActivityEvents({ onActivity });

    window.dispatchEvent(createWindowMessage("foo"));
    expect(onActivity).not.toHaveBeenCalled();

    const lastActive = new Date();
    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.USER_ACTIVITY,
        payload: {
          idle: true,
          lastActive,
        },
      }),
    );

    expect(onActivity).toHaveBeenCalledExactlyOnceWith({
      idle: true,
      lastActive,
    });

    removeListener();
    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.USER_ACTIVITY,
        payload: {
          idle: true,
          lastActive,
        },
      }),
    );
    expect(onActivity).toHaveBeenCalledOnce();
  });

  it("handles GenericEvents", () => {
    const showNotification = vi.fn();
    const clearNotification = vi.fn();
    host.setupGenericEventHandlers({
      showNotification,
      clearNotification,
    });

    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.GENERIC_EVENT,
        payload: {
          kind: "foo",
        },
      }),
    );

    expect(showNotification).not.toHaveBeenCalled();
    expect(clearNotification).not.toHaveBeenCalled();

    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.GENERIC_EVENT,
        payload: {
          kind: "showNotification",
          payload: { message: "mock toast" },
        },
      }),
    );

    expect(showNotification).toHaveBeenCalledExactlyOnceWith({
      kind: "showNotification",
      payload: { message: "mock toast" },
    });
    expect(clearNotification).not.toHaveBeenCalled();

    window.dispatchEvent(
      createWindowMessage({
        type: MESSAGES.GENERIC_EVENT,
        payload: {
          kind: "clearNotification",
          payload: { id: "mock id" },
        },
      }),
    );

    expect(showNotification).toHaveBeenCalledOnce();
    expect(clearNotification).toHaveBeenCalledExactlyOnceWith({
      kind: "clearNotification",
      payload: { id: "mock id" },
    });
  });
});
