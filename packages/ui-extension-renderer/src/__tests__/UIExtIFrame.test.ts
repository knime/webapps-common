import {
  expect,
  describe,
  beforeAll,
  afterEach,
  it,
  vi,
  type MockInstance,
} from "vitest";
import { shallowMount } from "@vue/test-utils";
import UIExtIFrame from "../UIExtIFrame.vue";
import type { UIExtensionServiceAPILayer } from "@knime/ui-extension-service";
import * as ExtensionServiceModule from "@knime/ui-extension-service";

vi.mock("@knime/ui-extension-service", async () => {
  const actual = await vi.importActual("@knime/ui-extension-service");
  return { ...actual };
});

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
      .spyOn(ExtensionServiceModule, "setUpIframeEmbedderService")
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
