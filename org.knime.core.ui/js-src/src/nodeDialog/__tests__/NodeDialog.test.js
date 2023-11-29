/* eslint-disable max-lines */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { JsonForms } from "@jsonforms/vue";
import {
  AlertTypes,
  JsonDataService,
  DialogService,
} from "@knime/ui-extension-service";
import {
  dialogApplyData,
  dialogInitialData,
} from "@@/test-setup/mocks/dialogData";
import Button from "webapps-common/ui/components/Button.vue";

import NodeDialog from "../NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "./utils";

window.closeCEFWindow = () => {};
const metaOrCtrlKey = "metaKey";

vi.mock("webapps-common/util/navigator", () => {
  return {
    getMetaOrCtrlKey: () => metaOrCtrlKey,
  };
});

describe("NodeDialog.vue", () => {
  let initialDataSpy;

  beforeEach(() => {
    vi.clearAllMocks();
    initialDataSpy = vi
      .spyOn(JsonDataService.prototype, "initialData")
      .mockResolvedValue({
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

    expect(spy).toHaveBeenCalledWith(false);
  });

  describe("keyboard shortcuts", () => {
    let wrapper, formWrapper, closeCEFWindowSpy, applyDataSpy;

    beforeEach(() => {
      wrapper = shallowMount(
        NodeDialog,
        getOptions({ stubButtonsBySlot: true }),
      );
      closeCEFWindowSpy = vi.spyOn(window, "closeCEFWindow");
      applyDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "applyData")
        .mockResolvedValue({});
      formWrapper = wrapper.find(".form");
    });

    it("executes node when metaOrCtrlKey is pressed on closeDialog", () => {
      formWrapper.trigger("keydown", { [metaOrCtrlKey]: true });

      wrapper.vm.closeDialog();

      expect(closeCEFWindowSpy).toHaveBeenCalledWith(true);
    });

    it("does not executes node when metaOrCtrlKey was pressed and released again on closeDialog", async () => {
      const okButton = wrapper.findAllComponents(Button).at(1);
      expect(okButton.html()).toBe("Ok");
      await formWrapper.trigger("keydown", { [metaOrCtrlKey]: true });
      expect(okButton.html()).toBe("Ok and Execute");
      await formWrapper.trigger("keyup", { [metaOrCtrlKey]: false });
      expect(okButton.html()).toBe("Ok");

      wrapper.vm.closeDialog();

      expect(closeCEFWindowSpy).toHaveBeenCalledWith(false);
    });

    it("triggers cancel on escape", async () => {
      await formWrapper.trigger("keydown", { key: "Escape" });
      expect(closeCEFWindowSpy).toHaveBeenCalledWith(false);
    });

    it("triggers on window keyboard event with body as target", () => {
      const event = new Event("keydown");
      event.key = "Escape";
      event[metaOrCtrlKey] = false;
      Object.defineProperty(event, "target", { value: document.body });
      window.dispatchEvent(event);
      expect(closeCEFWindowSpy).toHaveBeenCalledWith(false);
    });

    it("does not trigger on window keyboard event if target is not body", () => {
      const event = new Event("keydown");
      event.key = "Escape";
      event[metaOrCtrlKey] = false;
      Object.defineProperty(event, "target", { value: "not-the-body" });
      window.dispatchEvent(event);
      expect(closeCEFWindowSpy).not.toHaveBeenCalled();
    });

    it("triggers apply + close on enter", async () => {
      await formWrapper.trigger("keydown", { key: "Enter" });
      expect(applyDataSpy).toHaveBeenCalled();
      expect(closeCEFWindowSpy).toHaveBeenCalledWith(false);
    });

    it("triggers apply + close + execute on metaOrCtrlKey + enter", async () => {
      await formWrapper.trigger("keydown", {
        key: "Enter",
        [metaOrCtrlKey]: true,
      });
      expect(applyDataSpy).toHaveBeenCalled();
      expect(closeCEFWindowSpy).toHaveBeenCalledWith(true);
    });
  });

  it("provides 'getData' method", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const callParams = { method: "foo", options: ["bar"] };
    wrapper.vm.callDataService(callParams);
    expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith(callParams);
  });

  it("provides 'sendAlert' method", () => {
    const createAlertMock = vi.fn(() => ({ nodeInfo: {} }));
    const sendWarningMock = vi.fn();
    const options = getOptions({ createAlertMock, sendWarningMock });
    const wrapper = shallowMount(NodeDialog, options);
    const callParams = { type: AlertTypes.ERROR, message: "message" };
    wrapper.vm.sendAlert(callParams);
    expect(createAlertMock).toHaveBeenCalledWith(callParams);
    expect(sendWarningMock).toHaveBeenCalledWith({
      nodeInfo: { nodeName: " " },
    });
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
      method: "flowVariables.getAvailableFlowVariables",
      options: [
        JSON.stringify({
          data: currentData,
          flowVariableSettings: flowVariablesMap,
        }),
        ["path", "to", "my", "setting"],
      ],
    });
  });

  it("provides 'getFlowVariableOverrideValue' method", async () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const expectedResult = "value";
    const getDataSpy = vi
      .spyOn(wrapper.vm.jsonDataService, "data")
      .mockResolvedValue(expectedResult);
    const path = "path.to.my.setting";
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
    const result = await wrapper.vm.getFlowVariableOverrideValue(
      "_persistPath",
      path,
    );
    expect(getDataSpy).toHaveBeenCalledWith({
      method: "flowVariables.getFlowVariableOverrideValue",
      options: [
        JSON.stringify({
          data: currentData,
          flowVariableSettings: flowVariablesMap,
        }),
        ["path", "to", "my", "setting"],
      ],
    });
    expect(result).toStrictEqual(expectedResult);
  });

  it("provides 'unsetControllingFlowVariable' method", async () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const persistPath = "path.to.my.setting";
    await flushPromises();
    const flowVariablesMap = {
      [persistPath]: {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "myVar",
        exposedFlowVariableName: null,
      },
    };
    wrapper.vm.schema = { flowVariablesMap };
    wrapper.vm.unsetControllingFlowVariable(persistPath);
    expect(flowVariablesMap[persistPath]).toStrictEqual({
      controllingFlowVariableAvailable: false,
      controllingFlowVariableName: null,
      exposedFlowVariableName: null,
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
        method: "settings.getChoices",
        options: [choicesProviderClass],
      });
      expect(choices).toStrictEqual(mockChoices);
    });

    it("displays an error when getChoices returns state 'FAIL'", async () => {
      const myMessage = "MyMessage";
      const createAlertMock = vi.fn(() => ({ nodeInfo: {} }));
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
        subtitle: "Failed to fetch possible values.",
        message: myMessage,
      });
    });

    it("displays an error when getChoices returns state 'CANCELED'", async () => {
      const createAlertMock = vi.fn(() => ({ nodeInfo: {} }));
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
        subtitle: `Receiving possible values from ${choicesProviderClass} canceled.`,
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

  describe("flawed controlling variable paths", () => {
    it("sets variable path to flawed if 'getFlowVariableOverrideValue' returns undefined", async () => {
      const dirtySettingsMock = vi.fn();
      const wrapper = shallowMount(
        NodeDialog,
        getOptions({ dirtySettingsMock }),
      );
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue(undefined);
      const persistPath = "my.path";
      const flowSettings = {};
      await flushPromises();
      wrapper.vm.schema.flowVariablesMap[persistPath] = flowSettings;

      await wrapper.vm.getFlowVariableOverrideValue(persistPath, "_dataPath");

      expect(wrapper.vm.flawedControllingVariablePaths).toStrictEqual(
        new Set([persistPath]),
      );
      expect(dirtySettingsMock).toHaveBeenCalledWith(expect.anything(), true);
      expect(flowSettings.controllingFlowVariableFlawed).toBeTruthy();
    });

    it("excludes flawed overwritten variables from subsequent 'getFlowVariableOverrideValue' requests of other settings", async () => {
      const dirtySettingsMock = vi.fn();
      const wrapper = shallowMount(
        NodeDialog,
        getOptions({ dirtySettingsMock }),
      );
      const getDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "data")
        .mockResolvedValue("not_undefined");
      const persistPathFlawedSetting = "flawed";
      const persistPathOtherSetting = "other";
      await flushPromises();
      wrapper.vm.schema.flowVariablesMap = {
        [persistPathFlawedSetting]: {
          controllingFlowVariableName: "flawedSettingVariable",
          controllingFlowVariableFlawed: true,
        },
        [persistPathOtherSetting]: {
          controllingFlowVariableName: "otherSettingsVariable",
          controllingFlowVariableFlawed: false,
        },
      };
      wrapper.vm.flawedControllingVariablePaths.add(persistPathFlawedSetting);

      wrapper.vm.currentData = {};
      await wrapper.vm.getFlowVariableOverrideValue(
        persistPathOtherSetting,
        "_dataPath",
      );
      expect(getDataSpy).toHaveBeenCalledWith({
        method: "flowVariables.getFlowVariableOverrideValue",
        options: [
          `{"data":{},"flowVariableSettings":${JSON.stringify({
            [persistPathOtherSetting]: {
              controllingFlowVariableName: "otherSettingsVariable",
              controllingFlowVariableFlawed: false,
            },
          })}}`,
          ["_dataPath"],
        ],
      });
    });

    it("does not exclude flawed overwritten variable from subsequent 'getFlowVariableOverrideValue' request of the same setting", async () => {
      const dirtySettingsMock = vi.fn();
      const wrapper = shallowMount(
        NodeDialog,
        getOptions({ dirtySettingsMock }),
      );
      const getDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "data")
        .mockResolvedValue("not_undefined");
      const persistPathFlawedSetting = "flawed";
      await flushPromises();
      const variableSettingsMap = {
        [persistPathFlawedSetting]: {
          controllingFlowVariableName: "flawedSettingVariable",
          controllingFlowVariableFlawed: true,
        },
      };
      const variableSettingsMapBeforeRequest =
        JSON.stringify(variableSettingsMap);
      wrapper.vm.schema.flowVariablesMap = variableSettingsMap;
      wrapper.vm.flawedControllingVariablePaths.add(persistPathFlawedSetting);

      wrapper.vm.currentData = {};
      await wrapper.vm.getFlowVariableOverrideValue(
        persistPathFlawedSetting,
        "_dataPath",
      );
      expect(getDataSpy).toHaveBeenCalledWith({
        method: "flowVariables.getFlowVariableOverrideValue",
        options: [
          `{"data":{},"flowVariableSettings":${variableSettingsMapBeforeRequest}}`,
          ["_dataPath"],
        ],
      });
    });

    it("excludes initially set paths from 'getFlowVariableOverrideValue' request until the controlling variable is are changed", async () => {
      const initialSetting1 = "first";
      const initialSetting2 = "second";
      const flowSettings1 = {
        [initialSetting1]: {
          controllingFlowVariableName: "var1",
          controllingFlowVariableFlawed: true,
        },
      };
      const flowSettings2 = {
        [initialSetting2]: {
          controllingFlowVariableName: "var2",
          controllingFlowVariableFlawed: false,
        },
      };
      initialDataSpy.mockResolvedValue({
        data: {},
        schema: {},
        flowVariableSettings: {
          ...flowSettings1,
          ...flowSettings2,
        },
      });

      const wrapper = shallowMount(NodeDialog, getOptions());

      await flushPromises();
      expect(wrapper.vm.possiblyFlawedControllingVariablePaths).toStrictEqual(
        new Set([initialSetting1, initialSetting2]),
      );
      expect(flowSettings1.controllingFlowVariableFlawed).toBeUndefined();
      expect(flowSettings2.controllingFlowVariableFlawed).toBeUndefined();
      const getDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "data")
        .mockResolvedValue("not_undefined");

      wrapper.vm.currentData = {};
      await wrapper.vm.getFlowVariableOverrideValue(
        initialSetting1,
        "_dataPath",
      );
      expect(getDataSpy).toHaveBeenCalledWith({
        method: "flowVariables.getFlowVariableOverrideValue",
        options: [
          `{"data":{},"flowVariableSettings":${JSON.stringify(flowSettings1)}}`,
          ["_dataPath"],
        ],
      });

      /**
       * After the first request, flowSetting1 is known to be not flawed anymore,
       * so it will also be used for subsequent requests.
       */
      await wrapper.vm.getFlowVariableOverrideValue("other", "_dataPath");
      expect(getDataSpy).toHaveBeenCalledWith({
        method: "flowVariables.getFlowVariableOverrideValue",
        options: [
          `{"data":{},"flowVariableSettings":${JSON.stringify(flowSettings1)}}`,
          ["_dataPath"],
        ],
      });
    });

    it("unsets flawed variable path if 'getFlowVariableOverrideValue' returns a value", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue(
        "notUndefined",
      );
      const persistPath = "my.path";
      const flowSettings = { controllingFlowVariableFlawed: true };
      await flushPromises();
      wrapper.vm.schema.flowVariablesMap[persistPath] = flowSettings;
      wrapper.vm.flawedControllingVariablePaths.add(persistPath);

      await wrapper.vm.getFlowVariableOverrideValue(persistPath, "_dataPath");

      expect(wrapper.vm.flawedControllingVariablePaths).toStrictEqual(
        new Set([]),
      );
      expect(flowSettings.controllingFlowVariableFlawed).toBeFalsy();
    });

    it("dispatched 'cleanSettings' when the last flawed path is cleaned", async () => {
      const cleanSettingsMock = vi.fn();
      const wrapper = shallowMount(
        NodeDialog,
        getOptions({ cleanSettingsMock }),
      );
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue(
        "notUndefined",
      );
      const persistPaths = ["path1", "path2", "path3"];
      await flushPromises();
      wrapper.vm.flawedControllingVariablePaths = new Set(persistPaths);

      await wrapper.vm.getFlowVariableOverrideValue(
        persistPaths[0],
        "_dataPath",
      );
      await wrapper.vm.getFlowVariableOverrideValue(
        persistPaths[1],
        "_dataPath",
      );

      expect(cleanSettingsMock).not.toHaveBeenCalled();

      await wrapper.vm.getFlowVariableOverrideValue(
        persistPaths[2],
        "_dataPath",
      );

      expect(cleanSettingsMock).toHaveBeenCalled();
    });

    it("unsets flawed variable path if 'unsetControllingFlowVariable' is called", async () => {
      const cleanSettingsMock = vi.fn();
      const wrapper = shallowMount(
        NodeDialog,
        getOptions({ cleanSettingsMock }),
      );
      const persistPath = "path.to.my.setting";
      await flushPromises();
      const flowVariablesMap = {
        [persistPath]: {
          controllingFlowVariableFlawed: true,
        },
      };
      wrapper.vm.schema.flowVariablesMap = flowVariablesMap;

      wrapper.vm.unsetControllingFlowVariable(persistPath);

      expect(
        flowVariablesMap[persistPath].controllingFlowVariableFlawed,
      ).toBeFalsy();
      expect(cleanSettingsMock).toHaveBeenCalled();
    });
  });

  it("disables the ok-button if dialog is write-protected", async () => {
    vi.spyOn(DialogService.prototype, "isWriteProtected").mockReturnValue(true);
    const wrapper = shallowMount(NodeDialog, getOptions());
    await flushPromises();
    const button = wrapper.findAllComponents(Button).at(1);
    expect(button.props("disabled")).toBe(true);
  });
});
