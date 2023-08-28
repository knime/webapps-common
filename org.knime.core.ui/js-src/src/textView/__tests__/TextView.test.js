import { describe, it, beforeEach, expect, vi, afterEach } from "vitest";
import TextView from "../TextView.vue";
import { JsonDataService } from "@knime/ui-extension-service";
import shallowMountReportingComponent from "@@/test-setup/utils/shallowMountReportingComponent";
import flushPromises from "flush-promises";

describe("TextView.vue", () => {
  let wrapper, initialDataSpy, addOnDataChangeCallbackSpy;

  const defaultContent = "test data";
  const defaultFlowVariablesMap = {
    key1: "value1",
    key2: "value2",
  };

  const createJsonDataServiceMock = (
    content = defaultContent,
    flowVariablesMap = defaultFlowVariablesMap,
  ) => ({
    initialData: vi.fn(() => ({
      content,
      flowVariablesMap,
    })),
    addOnDataChangeCallback: vi.fn(),
  });

  const createSpies = (jsonDataServiceMock) => {
    JsonDataService.mockImplementation(() => jsonDataServiceMock);
    initialDataSpy = vi.spyOn(jsonDataServiceMock, "initialData");
    addOnDataChangeCallbackSpy = vi.spyOn(
      jsonDataServiceMock,
      "addOnDataChangeCallback",
    );
  };

  const mountWrapper = () => {
    const component = shallowMountReportingComponent(TextView);
    wrapper = component.wrapper;
  };

  beforeEach(() => {
    const jsonDataServiceMock = createJsonDataServiceMock();
    createSpies(jsonDataServiceMock);
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
    expect(wrapper.vm.richTextContent).toBe("test data");
  });

  it("adds on data change callback on mount", () => {
    expect(addOnDataChangeCallbackSpy).toHaveBeenCalled();
  });

  describe("onViewSettingsChange", () => {
    it("updates content on view settings change", async () => {
      const data = {
        data: {
          view: {
            richTextContent: "abcdefg",
          },
        },
        flowVariableSettings: {},
      };
      await wrapper.vm.onViewSettingsChange({ data });
      expect(wrapper.vm.richTextContent).toStrictEqual(
        data.data.view.richTextContent,
      );
    });

    it("replaces flow variables in text content on view settings change", async () => {
      const flowVariablesMap = {
        key1: "value1",
        key2: "value2",
      };
      const data = {
        data: {
          view: {
            richTextContent: '$$["key1"] abc $$["key2"]',
          },
        },
        flowVariableSettings: {},
      };
      wrapper.vm.flowVariablesMap = flowVariablesMap;
      await wrapper.vm.onViewSettingsChange({ data });
      expect(wrapper.vm.richTextContent).toBe(
        `${flowVariablesMap.key1} abc ${flowVariablesMap.key2}`,
      );
    });

    it("replaces flow variables in text for escaped quotes", async () => {
      const flowVariablesMap = {
        key1: "value1",
        key2: "value2",
      };
      const data = {
        data: {
          view: {
            richTextContent: "$$[&#34;key1&#34;] abc $$[&#34;key2&#34;]",
          },
        },
        flowVariableSettings: {},
      };
      wrapper.vm.flowVariablesMap = flowVariablesMap;
      await wrapper.vm.onViewSettingsChange({ data });
      expect(wrapper.vm.richTextContent).toBe(
        `${flowVariablesMap.key1} abc ${flowVariablesMap.key2}`,
      );
    });

    it("does not change richTextContent if it is controlled by flow variable", async () => {
      const data = {
        data: {
          view: {
            richTextContent: "abcdefg",
          },
        },
        flowVariableSettings: {
          "view.richTextContent": {
            controllingFlowVariableAvailable: true,
          },
        },
      };
      await wrapper.vm.onViewSettingsChange({ data });
      expect(wrapper.vm.richTextContent).toStrictEqual(defaultContent);
    });
  });

  it("replaces flow variables in text content on mount", async () => {
    const content = '$$["key1"] $$["key2"]';
    const jsonDataServiceMock = createJsonDataServiceMock(content);
    createSpies(jsonDataServiceMock);
    mountWrapper();
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.richTextContent).toBe("value1 value2");
  });

  it("notifies pagebuilder when component is mounted if it is in reporting context", async () => {
    const { wrapper, setRenderCompleted } = shallowMountReportingComponent(
      TextView,
      true,
    );
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(setRenderCompleted).toHaveBeenCalled();
  });
});
