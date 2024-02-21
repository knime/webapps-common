import {
  DialogService,
  JsonDataService,
  ReportingService,
  ResourceService,
  SelectionService,
} from "src";
import { setUpCustomEmbedderService, setUpEmbedderService } from "src/embedder";

describe("setUpEmbedderService", () => {
  it("can be used to create services", () => {
    const embedder = setUpEmbedderService({} as any);
    new JsonDataService(embedder.service);
    new ReportingService(embedder.service);
    new SelectionService(embedder.service);
    new DialogService(embedder.service);
    new SelectionService(embedder.service);
    new ResourceService(embedder.service);
  });

  it("passes method calls to the apiLayer", () => {
    const apiLayer = { someMethod: jest.fn() };
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
    const listener = jest.fn();
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
