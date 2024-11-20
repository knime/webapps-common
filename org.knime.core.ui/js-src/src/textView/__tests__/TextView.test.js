import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import {
  JsonDataService,
  SharedDataService,
} from "@knime/ui-extension-service";

import shallowMountReportingComponent from "@@/test-setup/utils/shallowMountReportingComponent";
import TextView from "../TextView.vue";

describe("TextView.vue", () => {
  let wrapper, initialDataSpy, addSharedDataListenerSpy;

  const initialContent = "test data";
  const dataServiceContent = "from data service";

  const createJsonDataServiceMock = () => ({
    initialData: vi.fn(() => ({
      content: initialContent,
    })),
    data: vi.fn(() => dataServiceContent),
  });

  const createSharedDataServiceMock = () => ({
    addSharedDataListener: vi.fn(),
  });

  const createSpies = (jsonDataServiceMock, sharedDataServiceMock) => {
    JsonDataService.mockImplementation(() => jsonDataServiceMock);
    initialDataSpy = vi.spyOn(jsonDataServiceMock, "initialData");
    SharedDataService.mockImplementation(() => sharedDataServiceMock);
    addSharedDataListenerSpy = vi.spyOn(
      sharedDataServiceMock,
      "addSharedDataListener",
    );
  };

  const mountWrapper = () => {
    const component = shallowMountReportingComponent(TextView);
    wrapper = component.wrapper;
  };

  beforeEach(() => {
    const jsonDataServiceMock = createJsonDataServiceMock();
    const sharedDataServiceMock = createSharedDataServiceMock();
    createSpies(jsonDataServiceMock, sharedDataServiceMock);
    mountWrapper();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders text view container", () => {
    expect(wrapper.find(".text-view-container").exists()).toBeTruthy();
  });

  it("calls initial data on mount", () => {
    expect(initialDataSpy).toHaveBeenCalled();
    expect(wrapper.vm.richTextContent).toBe(initialContent);
  });

  it("adds on data change callback on mount", () => {
    expect(addSharedDataListenerSpy).toHaveBeenCalled();
  });

  it("updates content with sanitized data on view settings change", async () => {
    const data = {
      data: {
        view: {
          richTextContent:
            'some unsanitized content with templates like $$["key1"] or $$["key2"]',
        },
      },
      flowVariableSettings: {},
    };
    await wrapper.vm.onViewSettingsChange(data);
    expect(wrapper.vm.richTextContent).toBe(dataServiceContent);
  });

  it("notifies embedder when component is mounted if it is in reporting context", async () => {
    const { wrapper, setRenderCompleted } = shallowMountReportingComponent(
      TextView,
      true,
    );
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(setRenderCompleted).toHaveBeenCalled();
  });
});
