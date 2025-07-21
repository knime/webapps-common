import { describe, expect, it, vi } from "vitest";
import { flushPromises, shallowMount } from "@vue/test-utils";

import * as IframeEmbedderModule from "../../logic/iframe/embedder";
import UIExtIFrame from "../UIExtIFrame.vue";
import type { UIExtensionServiceAPILayer } from "../types";

vi.mock("../../logic/iframe/embedder");

describe("UIExtIFrame.vue", () => {
  const resourceLocation = "resourceLocation";
  const apiLayer = {} as UIExtensionServiceAPILayer;

  const createUnwrappedPromise = <T>() => {
    let resolve: (value: T | PromiseLike<T>) => void = () => {};
    let reject: (reason?: any) => void = () => {};

    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });

    return { resolve, reject, promise };
  };

  type Dispatcher = Awaited<
    ReturnType<typeof IframeEmbedderModule.setUpIframeEmbedderService>
  >;

  const doMount = (
    mockDispatcher: Promise<Dispatcher> = Promise.resolve({
      dispatchPushEvent: vi.fn(),
    }),
  ) => {
    vi.mocked(IframeEmbedderModule.setUpIframeEmbedderService).mockReturnValue(
      mockDispatcher,
    );

    const wrapper = shallowMount(UIExtIFrame, {
      props: { resourceLocation, apiLayer },
    });

    return { wrapper };
  };

  it("emits 'serviceCreated' event", () => {
    const { wrapper } = doMount();

    expect(wrapper.emitted("serviceCreated")).toBeDefined();
  });

  it("queues dispatched events before iframe is ready", async () => {
    const iframeDispatcherMock = vi.fn();

    const done = vi.fn();
    const { promise, resolve } = createUnwrappedPromise<Dispatcher>();

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    promise.then(done);

    const { wrapper } = doMount(promise);
    expect(done).not.toHaveBeenCalled();
    const emittedDispatcher = wrapper.emitted(
      "serviceCreated",
    )![0][0] as Dispatcher;

    emittedDispatcher.dispatchPushEvent({
      eventType: "DisplayModeEvent",
      payload: { mode: "large" },
    });
    emittedDispatcher.dispatchPushEvent({
      eventType: "DisplayModeEvent",
      payload: { mode: "small" },
    });

    expect(done).not.toHaveBeenCalled();
    resolve({ dispatchPushEvent: iframeDispatcherMock });
    await flushPromises();

    expect(done).toHaveBeenCalledOnce();
    expect(iframeDispatcherMock).toHaveBeenNthCalledWith(1, {
      eventType: "DisplayModeEvent",
      payload: { mode: "large" },
    });
    expect(iframeDispatcherMock).toHaveBeenNthCalledWith(2, {
      eventType: "DisplayModeEvent",
      payload: { mode: "small" },
    });
  });
});
