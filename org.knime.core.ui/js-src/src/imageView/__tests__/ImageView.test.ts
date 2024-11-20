import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { Label } from "@knime/components";
import {
  JsonDataService,
  ReportingService,
  ResourceService,
  SharedDataService,
} from "@knime/ui-extension-service";

import * as fetchImage from "@/utils/images";
import ImageView from "../ImageView.vue";
import type { ImageViewSettings } from "../types/ImageViewSettings";

describe("ImageView.vue", () => {
  let jsonDataServiceMock: {
      initialData: Mock<any>;
    },
    sharedDataServiceMock: {
      addSharedDataListener: Mock<any>;
    };

  const defaultImagePath = "defaultImagePath";
  const defaultSettings = {
    title: "defaultTitle",
    altText: "defaultAltText",
    caption: "defaultCaption",
    shrinkToFit: false,
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
  });

  const createSharedDataServiceMock = () => ({
    addSharedDataListener: vi.fn(),
  });

  let getResourceUrl: Mock;
  const getMockResourceUrl = (path: string) => `Resource url ( ${path} )`;

  const mountComponent = async (isReport = false) => {
    getResourceUrl = vi.fn((path) => Promise.resolve(getMockResourceUrl(path)));
    const setRenderCompleted = vi.fn();
    (ResourceService as any).mockImplementation(() => ({
      getResourceUrl,
    }));
    (ReportingService as any).mockImplementation(
      ({ isReport }: { isReport: boolean }) => ({
        isReportingActive: () => isReport,
        setRenderCompleted,
      }),
    );
    const mountOptions = {
      global: {
        provide: {
          getKnimeService: () => ({
            isReport,
            extensionConfig: {},
          }),
        },
      },
    };
    const wrapper = mount(ImageView, mountOptions) as VueWrapper & {
      vm: {
        onViewSettingsChange: (param: {
          data: { view: Partial<ImageViewSettings> };
        }) => void;
        viewSettings: ImageViewSettings;
      };
    };
    await flushPromises();
    return { wrapper, setRenderCompleted };
  };

  beforeEach(() => {
    jsonDataServiceMock = createJsonDataServiceMock();
    sharedDataServiceMock = createSharedDataServiceMock();
    (JsonDataService as any).mockImplementation(() => jsonDataServiceMock);
    (SharedDataService as any).mockImplementation(() => sharedDataServiceMock);
    const setRenderCompleted = vi.fn();
    (ReportingService as any).mockImplementation((baseService: any) => ({
      isReportingActive: () => baseService.isReport,
      setRenderCompleted,
    }));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  const checkWrapper = (
    imageView: VueWrapper<any>,
    settings: {
      title: string;
      altText: string;
      caption: string;
      shrinkToFit: boolean;
    },
    imageSrc = getMockResourceUrl(defaultImagePath),
  ) => {
    expect(imageView.vm.viewSettings.title).toStrictEqual(settings.title);
    expect(imageView.vm.viewSettings.altText).toStrictEqual(settings.altText);
    expect(imageView.vm.viewSettings.caption).toStrictEqual(settings.caption);
    expect(imageView.vm.viewSettings.shrinkToFit).toStrictEqual(
      settings.shrinkToFit,
    );
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
    if (settings.shrinkToFit) {
      expect(img.classes()).toContain("scale");
    } else {
      expect(img.classes()).not.toContain("scale");
    }
  };

  it("renders image view", async () => {
    const { wrapper } = await mountComponent();
    checkWrapper(wrapper, defaultSettings);
  });

  it("sets image max height to natural height on load", async () => {
    const { wrapper } = await mountComponent();
    const image = wrapper.find("img");
    expect(image.element.onload).toBeTypeOf("function");
    Object.defineProperty(image.element, "naturalHeight", { value: 100 });
    image.element.onload!(new Event("load"));
    await wrapper.vm.$nextTick();
    expect(image.attributes("style")).toBe("--natural-image-height: 100px;");
  });

  it("renders image view when reporting enabled", async () => {
    const fetchImageSpy = vi
      .spyOn(fetchImage, "fetchImage")
      .mockResolvedValue(defaultFetchImageValue);
    const { wrapper } = await mountComponent(true);
    expect(fetchImageSpy).toHaveBeenCalled();
    checkWrapper(wrapper, defaultSettings, defaultFetchImageValue);
  });

  it("notifies pagebuilder when component is mounted if it is in reporting context", async () => {
    vi.spyOn(fetchImage, "fetchImage").mockResolvedValue(
      defaultFetchImageValue,
    );
    const { wrapper, setRenderCompleted } = await mountComponent(true);
    const image = wrapper.find("img");
    image.element.onload!(new Event("load"));
    await flushPromises();
    expect(setRenderCompleted).toHaveBeenCalled();
  });

  it("calls initial data on mount", async () => {
    const initialDataSpy = vi.spyOn(jsonDataServiceMock, "initialData");
    const { wrapper } = await mountComponent();
    expect(initialDataSpy).toHaveBeenCalled();
    expect(wrapper.vm.viewSettings.title).toStrictEqual(defaultSettings.title);
    expect(wrapper.vm.viewSettings.altText).toStrictEqual(
      defaultSettings.altText,
    );
    expect(wrapper.vm.viewSettings.caption).toStrictEqual(
      defaultSettings.caption,
    );
    expect(wrapper.vm.viewSettings.shrinkToFit).toStrictEqual(
      defaultSettings.shrinkToFit,
    );
  });

  it("adds on data change callback on mount", () => {
    const addOnDataChangeCallbackSpy = vi.spyOn(
      sharedDataServiceMock,
      "addSharedDataListener",
    );
    mountComponent();
    expect(addOnDataChangeCallbackSpy).toHaveBeenCalled();
  });

  describe("onViewSettingsChange", () => {
    it("updates content on view settings change", async () => {
      const { wrapper } = await mountComponent();
      const data = {
        data: {
          view: {
            title: "foo",
            altText: "bar",
            caption: "baz",
            shrinkToFit: true,
          },
        },
      };
      await wrapper.vm.onViewSettingsChange(data);
      checkWrapper(wrapper, data.data.view);
    });
  });

  it("updates content on empty title", async () => {
    const { wrapper } = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, title: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange(data);
    checkWrapper(wrapper, data.data.view);
  });

  it("updates content on empty caption", async () => {
    const { wrapper } = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, caption: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange(data);
    checkWrapper(wrapper, data.data.view);
  });

  it("updates content on empty title and caption", async () => {
    const { wrapper } = await mountComponent();
    const data = {
      data: {
        view: { ...defaultSettings, title: "", caption: "" },
      },
    };
    await wrapper.vm.onViewSettingsChange(data);
    checkWrapper(wrapper, data.data.view);
  });
});
