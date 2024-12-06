import {
  type MockInstance,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { shallowMount } from "@vue/test-utils";

import * as IframeEmbedderModule from "../../logic/iframe/embedder";
import UIExtIFrame from "../UIExtIFrame.vue";
import type { UIExtensionServiceAPILayer } from "../types";

describe("UIExtIFrame.vue", () => {
  const resourceLocation = "resourceLocation";
  const apiLayer = {} as UIExtensionServiceAPILayer;
  const mockedEmbedderService = {
    dispatchPushEvent: () => {},
  };

  let wrapper: ReturnType<typeof shallowMount>,
    setUpIframeEmbedderServiceSpy: MockInstance;

  beforeAll(() => {
    setUpIframeEmbedderServiceSpy = vi
      .spyOn(IframeEmbedderModule, "setUpIframeEmbedderService")
      .mockReturnValue(mockedEmbedderService);
    wrapper = shallowMount(UIExtIFrame, {
      props: { resourceLocation, apiLayer },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders html as iframes and sets up embedder service", () => {
    const iFrameWrapper = wrapper.find("iframe");
    expect(iFrameWrapper.exists()).toBeTruthy();
    expect(setUpIframeEmbedderServiceSpy).toHaveBeenCalledWith(
      apiLayer,
      iFrameWrapper.element.contentWindow,
    );
    expect(iFrameWrapper.attributes("src")).toBe(resourceLocation);
  });

  it("emits constructed service", () => {
    expect(wrapper.emitted("serviceCreated")![0][0]).toStrictEqual(
      mockedEmbedderService,
    );
  });
});
