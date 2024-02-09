import { expect, afterEach, vi, describe, it } from "vitest";
import flushPromises from "flush-promises";
import { shallowMount } from "@vue/test-utils";
import UIExtComponent from "../UIExtComponent.vue";
import { UIExtensionServiceAPILayer } from "@knime/ui-extension-service";
import * as ExtensionServiceModule from "@knime/ui-extension-service";
import { createApp, defineComponent } from "vue";

const MockComponent = defineComponent({
  name: "MockComp",
  template: "<div class='mock' />",
});

const dynamicImportMock = vi.fn();

vi.mock("../useDynamicImport", () => {
  return {
    useDynamicImport: () => ({
      dynamicImport: dynamicImportMock.mockResolvedValue({
        default: (shadowRoot: ShadowRoot) => {
          const holder = document.createElement("div");
          const app = createApp(MockComponent);
          app.mount(holder);
          shadowRoot.appendChild(holder);
          return { teardown: () => {} };
        },
      }),
    }),
  };
});

describe("UIExtComponent.vue", () => {
  const resourceInfo = {
    id: "org.knime.base.views.scatterplot.ScatterPlotNodeFactory",
  };
  const resourceLocation = "http://localhost:8080/my_widget.html";
  const apiLayer = {
    getConfig: () => ({
      initialData: null,
    }),
  } as UIExtensionServiceAPILayer;
  const context = {
    props: { resourceLocation, resourceInfo, apiLayer },
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", async () => {
    const wrapper = shallowMount(UIExtComponent, context);
    await flushPromises();

    expect(dynamicImportMock).toHaveBeenCalledWith(resourceLocation);
    expect(wrapper.findComponent(UIExtComponent).exists()).toBeTruthy();
    const loadContainer = wrapper.find(".ui-ext-component");
    const mockComponent =
      loadContainer.element.shadowRoot!.querySelector(".mock");
    expect(mockComponent).not.toBeNull();
  });

  it("creates, provides and emits embedder service", () => {
    const mockedBaseService = {} as ExtensionServiceModule.UIExtensionService;
    const mockedEmbedderService = {
      dispatchPushEvent: () => {},
      service: mockedBaseService,
    };
    const setUpEmbedderServiceSpy = vi
      .spyOn(ExtensionServiceModule, "setUpEmbedderService")
      .mockReturnValue(mockedEmbedderService);
    const wrapper = shallowMount(UIExtComponent, context);
    expect(setUpEmbedderServiceSpy).toHaveBeenCalledWith(apiLayer);
    expect(wrapper.emitted("serviceCreated")![0][0]).toBe(
      mockedEmbedderService,
    );
  });
});
