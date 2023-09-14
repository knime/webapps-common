import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { JsonForms } from "@jsonforms/vue";
import { AlertTypes, JsonDataService } from "@knime/ui-extension-service";
import {
  dialogApplyData,
  dialogInitialData,
} from "@@/test-setup/mocks/dialogData";

import NodeDialog from "../NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "./utils";

window.closeCEFWindow = () => {};

describe("NodeDialog.vue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(JsonDataService.prototype, "initialData").mockResolvedValue({
      ...dialogInitialData,
    });
    vi.spyOn(JsonDataService.prototype, "applyData").mockResolvedValue();
    vi.spyOn(JsonDataService.prototype, "publishData").mockResolvedValue();
  });

  it("renders empty wrapper", async () => {
    const setApplySettingsMock = vi.fn();
    const wrapper = shallowMount(
      NodeDialog,
      getOptions({ setApplySettingsMock }),
    );
    await flushPromises();

    expect(wrapper.getComponent(NodeDialog).exists()).toBe(true);
    expect(setApplySettingsMock).toHaveBeenCalled();
    expect(wrapper.find("a.advanced-options").exists()).not.toBe(true);
  });

  it("passes props to jsonform", async () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    await flushPromises();

    const jsonformsStub = wrapper.getComponent(JsonForms);

    expect(jsonformsStub.props("data")).toStrictEqual(dialogInitialData.data);
    expect(jsonformsStub.props("schema")).toStrictEqual(
      dialogInitialData.schema,
    );
    expect(jsonformsStub.props("uischema")).toStrictEqual(
      dialogInitialData.ui_schema,
    );
  });

  it("renders advanced settings", async () => {
    const advancedDialogData = { ...dialogInitialData };
    advancedDialogData.ui_schema.options = { isAdvanced: true };
    vi.spyOn(JsonDataService.prototype, "initialData").mockResolvedValueOnce(
      advancedDialogData,
    );
    const wrapper = shallowMount(NodeDialog, getOptions());
    await flushPromises();

    expect(wrapper.getComponent(NodeDialog).exists()).toBe(true);
    let advancedLink = wrapper.find("a.advanced-options");
    expect(advancedLink.exists()).toBe(true);
    expect(advancedLink.text()).toBe("Show advanced settings");

    await advancedLink.trigger("click");
    expect(advancedLink.text()).toBe("Hide advanced settings");
  });

  it("returns current values on getData", async () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    await flushPromises();

    expect(wrapper.vm.getData()).toStrictEqual(dialogApplyData);
  });

  describe("onSettingsChanged", () => {
    let wrapper,
      onSettingsChangedSpy,
      publishDataSpy,
      jsonformsStub,
      cleanSettingsMock;

    beforeEach(async () => {
      cleanSettingsMock = vi.fn();
      wrapper = shallowMount(NodeDialog, getOptions({ cleanSettingsMock }));
      onSettingsChangedSpy = vi.spyOn(wrapper.vm, "onSettingsChanged");
      publishDataSpy = vi.spyOn(wrapper.vm.jsonDataService, "publishData");

      await flushPromises();

      jsonformsStub = wrapper.getComponent(JsonForms);
    });

    it("sets new values", () => {
      jsonformsStub.vm.$emit("change", {
        data: { ...dialogInitialData.data, model: { yAxisScale: "NEW_VALUE" } },
      });

      expect(onSettingsChangedSpy).toHaveBeenCalledWith({
        data: { ...dialogInitialData.data, model: { yAxisScale: "NEW_VALUE" } },
      });

      const expectedData = {
        ...dialogInitialData.data,
        model: { yAxisScale: "NEW_VALUE" },
      };

      expect(publishDataSpy).toHaveBeenCalledWith({
        flowVariableSettings: dialogInitialData.schema.flowVariablesMap,
        data: expectedData,
      });
    });

    it("does not set new value if data is not provided", () => {
      jsonformsStub.vm.$emit("change", {});

      expect(wrapper.vm.getData()).toStrictEqual(dialogApplyData);
      expect(publishDataSpy).not.toHaveBeenCalled();
    });

    it("cleans settings if new data match original data", async () => {
      const payload = {
        data: { ...dialogInitialData.data, model: { yAxisScale: "NEW_VALUE" } },
      };
      wrapper.vm.setOriginalModelSettings(payload.data);
      await jsonformsStub.vm.$emit("change", payload);
      expect(onSettingsChangedSpy).toHaveBeenCalledWith(payload);
      expect(publishDataSpy).toHaveBeenCalled();
      expect(cleanSettingsMock).toHaveBeenCalledWith(
        expect.anything(),
        payload.data,
      );
    });
  });

  describe("applySettings", () => {
    it("calls apply data and closes window", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      const closeDialogSpy = vi.spyOn(wrapper.vm, "closeDialog");
      const applyDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "applyData")
        .mockReturnValue({});
      await flushPromises();

      await wrapper.vm.applySettingsCloseDialog();

      expect(applyDataSpy).toHaveBeenCalled();
      expect(closeDialogSpy).toHaveBeenCalled();
    });

    it("calls apply data and does not close window if settings are invalid", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      const closeDialogSpy = vi.spyOn(wrapper.vm, "closeDialog");
      const applyDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "applyData")
        .mockReturnValue({
          result: "test",
        });
      await flushPromises();

      await wrapper.vm.applySettingsCloseDialog();

      expect(applyDataSpy).toHaveBeenCalled();
      expect(closeDialogSpy).not.toHaveBeenCalled();
    });

    it("logs error that apply data been thrown", async () => {
      vi.spyOn(JsonDataService.prototype, "applyData").mockRejectedValue(
        new Error(),
      );
      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();

      expect(wrapper.vm.applySettingsCloseDialog()).rejects.toThrowError();
    });
  });

  it("calls window.closeCEFWindow in closeDialog", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const spy = vi.spyOn(window, "closeCEFWindow");

    wrapper.vm.closeDialog();

    expect(spy).toHaveBeenCalledWith();
  });

  it("provides 'getData' method", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const callParams = { method: "foo", options: ["bar"] };
    wrapper.vm.callDataService(callParams);
    expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith(callParams);
  });

  it("provides 'sendAlert' method", () => {
    const createAlertMock = vi.fn(() => "myAlert");
    const sendWarningMock = vi.fn();
    const options = getOptions({ createAlertMock, sendWarningMock });
    const wrapper = shallowMount(NodeDialog, options);
    const callParams = { type: AlertTypes.ERROR, message: "message" };
    wrapper.vm.sendAlert(callParams);
    expect(createAlertMock).toHaveBeenCalledWith(callParams);
    expect(sendWarningMock).toHaveBeenCalledWith("myAlert");
  });

  it("provides 'getAvailableFlowVariables' method", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const path = "path.to.my.setting";
    const currentData = { foo: "bar" };
    wrapper.vm.currentData = currentData;
    const flowVariablesMap = {};
    wrapper.vm.schema = { flowVariablesMap };
    wrapper.vm.getAvailableFlowVariables(path);
    expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
      method: "getAvailableFlowVariables",
      options: [
        JSON.stringify({
          data: currentData,
          flowVariableSettings: flowVariablesMap,
        }),
        ["path", "to", "my", "setting"],
      ],
    });
  });

  it("provides 'getFlowVariableOverrideValue' method", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const dataPath = "path.to.my.setting";
    const currentData = { foo: "bar" };
    const flowVariablesMap = {
      myPath: {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "myVar",
        exposedFlowVariableName: null,
      },
    };
    wrapper.vm.currentData = currentData;
    wrapper.vm.schema = { flowVariablesMap };
    wrapper.vm.getFlowVariableOverrideValue(dataPath);
    expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith({
      method: "getFlowVariableOverrideValue",
      options: [
        JSON.stringify({
          data: currentData,
          flowVariableSettings: flowVariablesMap,
        }),
        ["path", "to", "my", "setting"],
      ],
    });
  });

  describe("getPossibleValuesFromUiSchema", () => {
    it("provides 'getPossibleValuesFromUiSchema' method", async () => {
      const mockChoices = [{ id: "foo", text: "bar" }];
      const wrapper = shallowMount(NodeDialog, getOptions());
      const getDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "data")
        .mockResolvedValue({ state: "SUCCESS", result: mockChoices });
      const choicesProviderClass = "myChoicesProviderClass";
      const choices = await wrapper.vm.getPossibleValuesFromUiSchema({
        uischema: {
          options: { choicesProviderClass },
        },
      });
      expect(getDataSpy).toHaveBeenCalledWith({
        method: "getChoices",
        options: [choicesProviderClass],
      });
      expect(choices).toStrictEqual(mockChoices);
    });

    it("displays an error when getChoices returns state 'FAIL'", async () => {
      const myMessage = "MyMessage";
      const createAlertMock = vi.fn();
      const wrapper = shallowMount(NodeDialog, getOptions({ createAlertMock }));
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue({
        state: "FAIL",
        message: myMessage,
      });
      const choices = await wrapper.vm.getPossibleValuesFromUiSchema({
        uischema: {
          options: { choicesProviderClass: "myChoicesProviderClass" },
        },
      });
      expect(choices).toStrictEqual([]);
      expect(createAlertMock).toHaveBeenCalledWith({
        type: AlertTypes.ERROR,
        message: `Failed to fetch possible values: ${myMessage}`,
      });
    });

    it("displays an error when getChoices returns state 'CANCELLED'", async () => {
      const createAlertMock = vi.fn();
      const wrapper = shallowMount(NodeDialog, getOptions({ createAlertMock }));
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue({
        state: "CANCELED",
      });
      const choicesProviderClass = "myChoicesProviderClass";
      const choices = await wrapper.vm.getPossibleValuesFromUiSchema({
        uischema: {
          options: { choicesProviderClass },
        },
      });
      expect(choices).toStrictEqual([]);
      expect(createAlertMock).toHaveBeenCalledWith({
        type: AlertTypes.ERROR,
        message: `Receiving possible values from ${choicesProviderClass} canceled.`,
      });
    });
  });

  describe("registerWatcher", () => {
    it("provides registerWatcher method", () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      // this.registerWatcher is undefined in the test setup, so we just check for the key.
      expect(
        Object.getOwnPropertyNames(wrapper.vm.$options.provide()),
      ).toContain("registerWatcher");
    });

    it("adds watcher when calling registerWatcher", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();

      wrapper.setData({
        currentData: {
          test: "test",
          test2: "test",
          otherTest: "test",
        },
      });

      const transformSettings = vi.fn();
      const init = vi.fn();
      const dependencies = ["#/properties/test", "#/properties/test2"];

      await wrapper.vm.registerWatcher({ transformSettings, dependencies });

      expect(wrapper.vm.registeredWatchers.length).toBe(1);
      expect(wrapper.vm.registeredWatchers[0]).toStrictEqual({
        transformSettings,
        dataPaths: ["test", "test2"],
      });
      expect(init).not.toHaveBeenCalled();

      await wrapper.vm.registerWatcher({
        transformSettings,
        init,
        dependencies,
      });

      expect(wrapper.vm.registeredWatchers.length).toBe(2);
      expect(wrapper.vm.registeredWatchers[1]).toStrictEqual({
        transformSettings,
        dataPaths: ["test", "test2"],
      });
      expect(init).toHaveBeenCalled();
    });
  });

  describe("updateData", () => {
    let wrapper, handleChange, registeredWatchers;

    const settingsData = {
      currentData: {
        test1: "test",
        test2: "test",
        test3: "test",
        test4: "test",
      },
    };

    beforeEach(async () => {
      wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();

      wrapper.setData(settingsData);

      registeredWatchers = [
        {
          transformSettings: vi.fn((data) => {
            data.test4 = "transformed";
          }),
          dependencies: ["#/properties/test1", "#/properties/test2"],
        },
        {
          transformSettings: vi.fn(),
          dependencies: ["#/properties/test2", "#/properties/test3"],
        },
      ];

      handleChange = vi.fn(() => {});
      registeredWatchers.forEach(async (watcher) => {
        await wrapper.vm.registerWatcher(watcher);
      });
    });

    it("updates data normally if no watchers are triggered", async () => {
      const path = "test4";
      const data = "some data";
      await wrapper.vm.updateData(handleChange, path, data);
      registeredWatchers.forEach(({ transformSettings }) => {
        expect(transformSettings).not.toHaveBeenCalled();
      });
      expect(handleChange).toHaveBeenCalledWith(path, data);
    });

    it("transforms settings for triggered watchers and updates data", async () => {
      const path = "test2";
      const data = "some data";
      await wrapper.vm.updateData(handleChange, path, data);
      registeredWatchers.forEach(({ transformSettings }) => {
        expect(transformSettings).toHaveBeenCalled();
      });
      expect(handleChange).toHaveBeenCalledWith("", {
        ...wrapper.vm.getData().data,
        test2: data,
        test4: "transformed",
      });
    });

    it("reacts to path updates nested inside array layouts", async () => {
      await wrapper.setData({
        currentData: {
          arrayLayoutSetting: [{ value: "first" }, { value: "second" }],
        },
      });

      const arrayLayoutWatcher = {
        transformSettings: vi.fn(),
        dependencies: ["#/properties/arrayLayoutSetting"],
      };

      await wrapper.vm.registerWatcher(arrayLayoutWatcher);
      const path = "arrayLayoutSetting.0.value";
      const data = "some data";
      await wrapper.vm.updateData(handleChange, path, data);

      expect(arrayLayoutWatcher.transformSettings).toHaveBeenCalled();

      expect(handleChange).toHaveBeenCalledWith("", {
        ...wrapper.vm.getData().data,
        arrayLayoutSetting: [{ value: "some data" }, { value: "second" }],
      });
    });
  });
});
