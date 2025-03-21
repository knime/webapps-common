import { describe, expect, it, vi } from "vitest";

import { setUpCustomEmbedderService } from "../embedder";

describe("setUpEmbedderService", () => {
  it("passes method calls to the apiLayer", () => {
    const apiLayer = { someMethod: vi.fn() };
    const defaultEmbedder = setUpCustomEmbedderService(apiLayer);

    const param = "foo";
    defaultEmbedder.service.someMethod(param);

    expect(apiLayer.someMethod).toHaveBeenCalledWith("foo");
  });

  it("reveives extensionConfig with getConfig", () => {
    const extensionConfig = { nodeId: "123" };
    const defaultEmbedder = setUpCustomEmbedderService({
      getConfig: () => extensionConfig,
    });

    expect(defaultEmbedder.service.getConfig()).toBe(extensionConfig);
  });

  it("enables adding pushEvent listeners and dispatching events", () => {
    const defaultEmbedder = setUpCustomEmbedderService({});
    const listener = vi.fn();
    const pushEventType = "my-push-event";
    defaultEmbedder.service.addPushEventListener(pushEventType, listener);

    defaultEmbedder.dispatchPushEvent({
      eventType: "other-push-event",
      payload: "foo",
    });
    expect(listener).not.toHaveBeenCalled();

    const payload = "bar";
    defaultEmbedder.dispatchPushEvent({ eventType: pushEventType, payload });
    expect(listener).toHaveBeenCalledWith(payload);
  });
});
