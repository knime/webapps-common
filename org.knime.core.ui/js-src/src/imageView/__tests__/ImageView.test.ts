import {
  describe,
  it,
  beforeEach,
  expect,
  vi,
  afterEach,
  type Mock,
} from "vitest";
import ImageView from "../ImageView.vue";
import { JsonDataService, ReportingService } from "@knime/ui-extension-service";
import Label from "webapps-common/ui/components/forms/Label.vue";
import flushPromises from "flush-promises";
import { createStore } from "vuex";
import { VueWrapper, mount } from "@vue/test-utils";
import * as fetchImage from "@/utils/images";

describe("ImageView.vue", () => {
  let jsonDataServiceMock: {
    initialData: Mock<any>;
    addOnDataChangeCallback: Mock<any, any>;
  };

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
          store: createStore(storeOptions),
        },
      },
    };
    const wrapper = mount(ImageView, mountOptions);
    await flushPromises();
    return wrapper;
  };

  beforeEach(() => {
    jsonDataServiceMock = createJsonDataServiceMock();
    (JsonDataService as Mock).mockImplementation(() => jsonDataServiceMock);
    const setRenderCompleted = vi.fn();
    (ReportingService as Mock).mockImplementation((knimeService) => ({
      isReportingActive: () => knimeService.isReport,
      setRenderCompleted,
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const checkWrapper = (
    imageView: VueWrapper<any>,
    settings: { title: string; altText: string; caption: string },
    imageSrc = defaultBaseUrl + defaultImagePath,
  ) => {
    expect(imageView.vm.viewSettings.title).toStrictEqual(settings.title);
    expect(imageView.vm.viewSettings.altText).toStrictEqual(settings.altText);
    expect(imageView.vm.viewSettings.caption).toStrictEqual(settings.caption);
    const label = imageView.findComponent(Label);
    let id;
    if (settings.title) {
      expect(label.exists()).toBeTruthy();
      expect(label.text()).toContain(settings.title);
      id = label.find("label").attributes().for;
    } else {
      expect(label.exists()).toBeFalsy();
    }
    const figure = imageView.find("figure");
    const img = imageView.find("img");
    if (settings.caption) {
      expect(figure.exists()).toBeTruthy();
      expect(figure.attributes().id).toStrictEqual(id);
      expect(img.attributes().id).toBeUndefined();
      const figcaption = figure.find("figcaption");
      expect(figcaption.text()).toStrictEqual(settings.caption);
    } else {
      expect(figure.exists()).toBeFalsy();
      expect(img.attributes().id).toStrictEqual(id);
    }
    expect(img.exists()).toBeTruthy();
    expect(img.attributes().src).toStrictEqual(imageSrc);
    expect(img.attributes().alt).toStrictEqual(settings.altText);
  };

  it("renders image view", async () => {
    const wrapper = await mountComponent();
    checkWrapper(wrapper, defaultSettings);
  });

  it("renders image view when reporting enabled", async () => {
    const fetchImageSpy = vi
      .spyOn(fetchImage, "fetchImage")
      .mockResolvedValue(defaultFetchImageValue);
    const wrapper = await mountComponent(true);
    expect(fetchImageSpy).toHaveBeenCalled();
    checkWrapper(wrapper, defaultSettings, defaultFetchImageValue);
  });

  it("calls initial data on mount", async () => {
    const initialDataSpy = vi.spyOn(jsonDataServiceMock, "initialData");
    const wrapper = await mountComponent();
    expect(initialDataSpy).toHaveBeenCalled();
    expect(wrapper.vm.viewSettings.title).toStrictEqual(defaultSettings.title);
    expect(wrapper.vm.viewSettings.altText).toStrictEqual(
      defaultSettings.altText,
    );
    expect(wrapper.vm.viewSettings.caption).toStrictEqual(
      defaultSettings.caption,
    );
  });

  it("adds on data change callback on mount", () => {
    const addOnDataChangeCallbackSpy = vi.spyOn(
      jsonDataServiceMock,
      "addOnDataChangeCallback",
    );
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
