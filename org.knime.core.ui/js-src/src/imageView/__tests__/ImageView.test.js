import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import ImageView from "../ImageView.vue";
import { JsonDataService, ReportingService } from "@knime/ui-extension-service";
import Label from "webapps-common/ui/components/forms/Label.vue";
import * as fetchImage from "../../tableView/utils/images";
import flushPromises from "flush-promises";
import { createStore } from "vuex";
import { mount } from "@vue/test-utils";

describe("ImageView.vue", () => {
  let store, initialDataSpy, addOnDataChangeCallbackSpy, fetchImageSpy;

  const defaultBaseUrl = "defaultBaseUrl";
  const defaultImagePath = "defaultImagePath";
  const defaultSettings = {
    title: "defaultTitle",
    altText: "defaultAltText",
    caption: "defaultCaption",
  };
  const defaultFetchImageValue = "defaultFetchImageValue";

  const createJsonDataServiceMock = (
    settings = defaultSettings,
    imagePath = defaultImagePath,
  ) => ({
    initialData: vi.fn(() => ({
      settings,
      imagePath,
    })),
    addOnDataChangeCallback: vi.fn(),
  });

  const createSpies = () => {
    const jsonDataServiceMock = createJsonDataServiceMock();
    JsonDataService.mockImplementation(() => jsonDataServiceMock);
    initialDataSpy = vi.spyOn(jsonDataServiceMock, "initialData");
    addOnDataChangeCallbackSpy = vi.spyOn(
      jsonDataServiceMock,
      "addOnDataChangeCallback",
    );
    fetchImageSpy = vi.spyOn(fetchImage, "fetchImage");
  };

  const storeOptions = {
    modules: {
      api: {
        getters: {
          uiExtResourceLocation: () =>
            vi.fn(
              ({ resourceInfo }) => resourceInfo.baseUrl + resourceInfo.path,
            ),
        },
        namespaced: true,
      },
    },
  };

  const mountComponent = async (isReport = false) => {
    const mountOptions = {
      global: {
        provide: {
          getKnimeService: () => ({
            isReport,
            extensionConfig: {
              resourceInfo: {
                baseUrl: defaultBaseUrl,
              },
            },
          }),
          store,
        },
        mocks: {
          $store: store,
        },
      },
    };
    const wrapper = mount(ImageView, mountOptions);
    await flushPromises();
    return wrapper;
  };

  beforeEach(() => {
    createSpies();
    const setRenderCompleted = vi.fn();
    // eslint-disable-next-line no-extra-parens
    ReportingService.mockImplementation((knimeService) => ({
      isReportingActive: () => knimeService.isReport,
      setRenderCompleted,
    }));
    store = createStore(storeOptions);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const checkWrapper = (
    imageViewWrapper,
    settings,
    imageSrc = defaultBaseUrl + defaultImagePath,
  ) => {
    expect(imageViewWrapper.vm.title).toStrictEqual(settings.title);
    expect(imageViewWrapper.vm.altText).toStrictEqual(settings.altText);
    expect(imageViewWrapper.vm.caption).toStrictEqual(settings.caption);
    let wrapper = imageViewWrapper;
    if (settings.title) {
      wrapper = wrapper.findComponent(Label);
      expect(wrapper.exists()).toBeTruthy();
      expect(wrapper.text()).toContain(settings.title);
    }
    if (settings.caption) {
      wrapper = wrapper.find("figure");
      expect(wrapper.exists()).toBeTruthy();
      const figcaption = wrapper.find("figcaption");
      expect(figcaption.text()).toStrictEqual(settings.caption);
    }
    const img = wrapper.find("img");
    expect(img.exists()).toBeTruthy();
    expect(img.attributes().src).toStrictEqual(imageSrc);
    expect(img.attributes().alt).toStrictEqual(settings.altText);
  };

  it("renders image view", async () => {
    const wrapper = await mountComponent();
    checkWrapper(wrapper, defaultSettings);
  });

  it("renders image view when reporting enabled", async () => {
    fetchImageSpy.mockResolvedValue(defaultFetchImageValue);
    const wrapper = await mountComponent(true);
    expect(fetchImageSpy).toHaveBeenCalled();
    checkWrapper(wrapper, defaultSettings, defaultFetchImageValue);
  });

  it("calls initial data on mount", async () => {
    const wrapper = await mountComponent();
    expect(initialDataSpy).toHaveBeenCalled();
    expect(wrapper.vm.imagePath).toStrictEqual(defaultImagePath);
    expect(wrapper.vm.title).toStrictEqual(defaultSettings.title);
    expect(wrapper.vm.altText).toStrictEqual(defaultSettings.altText);
    expect(wrapper.vm.caption).toStrictEqual(defaultSettings.caption);
  });

  it("adds on data change callback on mount", () => {
    mountComponent();
    expect(addOnDataChangeCallbackSpy).toHaveBeenCalled();
  });

  describe("onViewSettingsChange", () => {
    it("updates content on view settings change", async () => {
      const wrapper = await mountComponent();
      const data = {
        data: {
          view: {
            title: "foo",
            altText: "bar",
            caption: "baz",
          },
        },
      };
      await wrapper.vm.onViewSettingsChange({ data });
      checkWrapper(wrapper, data.data.view);
    });
  });

  it("updates content on empty title", async () => {
    const wrapper = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, title: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange({ data });
    checkWrapper(wrapper, data.data.view);
  });

  it("updates content on empty caption", async () => {
    const wrapper = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, caption: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange({ data });
    checkWrapper(wrapper, data.data.view);
  });

  it("updates content on empty title and caption", async () => {
    const wrapper = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, title: "", caption: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange({ data });
    checkWrapper(wrapper, data.data.view);
  });
});
