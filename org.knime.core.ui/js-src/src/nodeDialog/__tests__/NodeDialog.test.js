/* eslint-disable max-lines */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { JsonForms } from "@jsonforms/vue";
import {
  AlertType,
  JsonDataService,
  DialogService,
  AlertingService,
} from "@knime/ui-extension-service";
import {
  dialogApplyData,
  dialogInitialData,
} from "/test-setup/mocks/dialogData";

import NodeDialog from "../NodeDialog.vue";
import flushPromises from "flush-promises";

import { getOptions } from "./utils";

describe("NodeDialog.vue", () => {
  let initialDataSpy,
    setApplyListenerSpy; 

  beforeEach(() => {
    vi.clearAllMocks();
    initialDataSpy = vi
      .spyOn(JsonDataService.prototype, "initialData")
      .mockResolvedValue({
        ...dialogInitialData,
      });
    vi.spyOn(JsonDataService.prototype, "applyData").mockResolvedValue();
    vi.spyOn(DialogService.prototype, "publishSettings").mockResolvedValue();
    setApplyListenerSpy = vi.spyOn(DialogService.prototype, "setApplyListener");
  });

  it("renders empty wrapper", async () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    await flushPromises();

    expect(wrapper.getComponent(NodeDialog).exists()).toBe(true);
    expect(setApplyListenerSpy).toHaveBeenCalled();
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
    let wrapper, onSettingsChangedSpy, publishDataSpy, jsonformsStub;

    beforeEach(async () => {
      wrapper = shallowMount(NodeDialog, getOptions());
      onSettingsChangedSpy = vi.spyOn(wrapper.vm, "onSettingsChanged");
      publishDataSpy = vi.spyOn(wrapper.vm.dialogService, "publishSettings");

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
  });

  describe("applySettings", () => {
    let wrapper;

    beforeEach(async () => {
      setApplyListenerSpy.mockReset();
      wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();
    });

    it("calls apply data with successful response", async () => {
      const applyListener = setApplyListenerSpy.mock.calls[0][0];

      const applyDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "applyData")
        .mockReturnValue({});
      await flushPromises();

      expect(await applyListener()).toStrictEqual({ isApplied: true });

      expect(applyDataSpy).toHaveBeenCalled();
    });

    it("calls apply data with erroneous response", async () => {
      const applyListener = setApplyListenerSpy.mock.calls[0][0];

      const applyDataSpy = vi
        .spyOn(wrapper.vm.jsonDataService, "applyData")
        .mockReturnValue({ result: "Settings are bad!" });
      await flushPromises();

      expect(await applyListener()).toStrictEqual({ isApplied: false });
      expect(applyDataSpy).toHaveBeenCalled();
    });

    it("logs error that apply data been thrown", () => {
      vi.spyOn(JsonDataService.prototype, "applyData").mockRejectedValue(
        new Error(),
      );

      expect(wrapper.vm.applySettings()).rejects.toThrowError();
    });
  });

  it("provides 'getData' method", () => {
    const wrapper = shallowMount(NodeDialog, getOptions());
    const callParams = { method: "foo", options: ["bar"] };
    wrapper.vm.callDataService(callParams);
    expect(wrapper.vm.jsonDataService.data).toHaveBeenCalledWith(callParams);
  });

  it("provides 'sendAlert' method", () => {
    const sendAlert = vi.fn();
    AlertingService.mockImplementation(() => ({
      sendAlert,
    }));
    const options = getOptions();
    const wrapper = shallowMount(NodeDialog, options);
    const callParams = { type: AlertType.ERROR, message: "message" };
    wrapper.vm.sendAlert(callParams);
    expect(sendAlert).toHaveBeenCalledWith(callParams, true);
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

  describe("getPossibleValuesFromUiSchema", () => {
    let sendAlert;

    beforeEach(() => {
      sendAlert = vi.fn();
      AlertingService.mockImplementation(() => ({
        sendAlert,
      }));
    });

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
      const wrapper = shallowMount(NodeDialog, getOptions());
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
      expect(sendAlert).toHaveBeenCalledWith(
        {
          type: AlertType.ERROR,
          subtitle: "Failed to fetch possible values.",
          message: myMessage,
        },
        true,
      );
    });

    it("displays an error when getChoices returns state 'CANCELED'", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
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
      expect(sendAlert).toHaveBeenCalledWith(
        {
          type: AlertType.ERROR,
          subtitle: `Receiving possible values from ${choicesProviderClass} canceled.`,
        },
        true,
      );
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
      expect(wrapper.vm.registeredWatchers[0]).toMatchObject({
        dataPaths: ["test", "test2"],
      });
      expect(init).not.toHaveBeenCalled();

      await wrapper.vm.registerWatcher({
        transformSettings,
        init,
        dependencies,
      });

      expect(wrapper.vm.registeredWatchers.length).toBe(2);
      expect(wrapper.vm.registeredWatchers[1]).toMatchObject({
        dataPaths: ["test", "test2"],
      });
      expect(init).toHaveBeenCalled();
    });

    it("removes watcher when calling the returned value of registerWatcher", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();

      wrapper.setData({
        currentData: {
          test: "test",
          test2: "test",
          otherTest: "test",
        },
      });

      const dependencies = ["#/properties/test", "#/properties/test2"];

      const unwatch = await wrapper.vm.registerWatcher({
        transformSettings: vi.fn(),
        dependencies,
      });

      expect(wrapper.vm.registeredWatchers.length).toBe(1);

      unwatch();

      expect(wrapper.vm.registeredWatchers.length).toBe(0);
    });
  });

  describe("updateData (old mechanism: registerWatchers)", () => {
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

  describe("value updates, triggers and stateProviderListeners", () => {
    const uiSchemaKey = "ui_schema";
    let globalUpdates, initialUpdates;

    beforeEach(() => {
      initialDataSpy.mockImplementation(
        vi.fn(() =>
          Promise.resolve({
            data: {
              view: {
                firstSetting: "firstSetting",
              },
              model: {
                secondSetting: "secondSetting",
              },
            },
            schema: {},
            [uiSchemaKey]: {
              globalUpdates,
              initialUpdates,
            },
            flowVariableSettings: {},
          }),
        ),
      );
    });

    const getDataServiceSpy = () => {
      return vi.spyOn(JsonDataService.prototype, "data");
    };

    const getWrapperWithDataServiceSpy = async () => {
      const dataServiceSpy = getDataServiceSpy();
      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();
      return { wrapper, dataServiceSpy };
    };

    it("handles value updates", async () => {
      const triggerId = "myTriggerId";
      const dependencyId = "myDependencyId";
      globalUpdates = [
        {
          trigger: {
            scope: "#/properties/view/properties/firstSetting",
            id: triggerId,
          },
          dependencies: [
            {
              id: dependencyId,
              scope: "#/properties/model/properties/secondSetting",
            },
          ],
        },
      ];

      const { wrapper, dataServiceSpy } = await getWrapperWithDataServiceSpy();

      const triggeringValue = "some data";
      const handleChange = vi.fn(() => {});

      const updatedValue = "updated";
      dataServiceSpy.mockResolvedValue({
        result: [
          {
            path: "#/properties/model/properties/secondSetting",
            value: updatedValue,
          },
        ],
      });

      await wrapper.vm.updateData(
        handleChange,
        "view.firstSetting",
        triggeringValue,
      );
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "settings.update2",
        options: [null, triggerId, { [dependencyId]: "secondSetting" }],
      });
      expect(handleChange).toHaveBeenCalledWith("", {
        view: {
          firstSetting: triggeringValue,
        },
        model: {
          secondSetting: updatedValue,
        },
      });
    });

    it("handles updates triggered by a widget user interaction", async () => {
      const triggerId = "myTriggerId";
      const dependencyId = "myDependencyId";
      globalUpdates = [
        {
          trigger: {
            id: triggerId,
          },
          dependencies: [
            {
              id: dependencyId,
              scope: "#/properties/model/properties/secondSetting",
            },
          ],
        },
      ];

      const { wrapper, dataServiceSpy } = await getWrapperWithDataServiceSpy();

      const updatedValue = "updated";
      dataServiceSpy.mockResolvedValue({
        result: [
          {
            path: "#/properties/model/properties/secondSetting",
            value: updatedValue,
          },
        ],
      });

      await wrapper.vm.trigger(triggerId);
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "settings.update2",
        options: [null, triggerId, { [dependencyId]: "secondSetting" }],
      });
      expect(wrapper.vm.currentData).toStrictEqual({
        view: {
          firstSetting: "firstSetting",
        },
        model: {
          secondSetting: updatedValue,
        },
      });
    });

    it("calls registered state provider listeners on update", async () => {
      const triggerId = "myTriggerId";
      const dependencyId = "myDependencyId";
      globalUpdates = [
        {
          trigger: {
            id: triggerId,
          },
          dependencies: [
            {
              id: dependencyId,
              scope: "#/properties/model/properties/secondSetting",
            },
          ],
        },
      ];

      const { wrapper, dataServiceSpy } = await getWrapperWithDataServiceSpy();

      const stateProviderId = "myId";

      const stateProviderListener = vi.fn();
      wrapper.vm.addStateProviderListener(
        stateProviderId,
        stateProviderListener,
      );
      const updatedValue = "updated";
      dataServiceSpy.mockResolvedValue({
        result: [
          {
            id: stateProviderId,
            value: updatedValue,
          },
        ],
      });
      await wrapper.vm.trigger(triggerId);
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "settings.update2",
        options: [null, triggerId, { [dependencyId]: "secondSetting" }],
      });

      expect(stateProviderListener).toHaveBeenCalledWith(updatedValue);
    });

    it("handles updates triggered before the dialog is opened", async () => {
      const updatedValue = "updatedValue";
      initialUpdates = [
        {
          path: "#/properties/model/properties/secondSetting",
          value: updatedValue,
        },
      ];

      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();
      expect(wrapper.vm.currentData).toStrictEqual({
        view: {
          firstSetting: "firstSetting",
        },
        model: {
          secondSetting: updatedValue,
        },
      });
    });

    it("handles updates triggered after the dialog is opened", async () => {
      const triggerId = "after-open-dialog";

      globalUpdates = [
        {
          trigger: {
            id: triggerId,
            triggerInitially: true,
          },
          dependencies: [],
        },
      ];

      const dataServiceSpy = getDataServiceSpy();
      const updatedValue = "updated";
      dataServiceSpy.mockResolvedValue({
        result: [
          {
            path: "#/properties/model/properties/secondSetting",
            value: updatedValue,
          },
        ],
      });
      const wrapper = shallowMount(NodeDialog, getOptions());
      await flushPromises();

      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "settings.update2",
        options: [null, triggerId, {}],
      });
      expect(wrapper.vm.currentData).toStrictEqual({
        view: {
          firstSetting: "firstSetting",
        },
        model: {
          secondSetting: updatedValue,
        },
      });
    });
  });

  describe("flawed controlling variable paths", () => {
    it("sets variable path to flawed if 'getFlowVariableOverrideValue' returns undefined", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
      vi.spyOn(wrapper.vm.jsonDataService, "data").mockResolvedValue(undefined);
      const persistPath = "my.path";
      const flowSettings = {};
      await flushPromises();
      wrapper.vm.schema.flowVariablesMap[persistPath] = flowSettings;

      await wrapper.vm.getFlowVariableOverrideValue(persistPath, "_dataPath");

      expect(wrapper.vm.flawedControllingVariablePaths).toStrictEqual(
        new Set([persistPath]),
      );
      expect(flowSettings.controllingFlowVariableFlawed).toBeTruthy();
    });

    it("excludes flawed overwritten variables from subsequent 'getFlowVariableOverrideValue' requests of other settings", async () => {
      const wrapper = shallowMount(NodeDialog, getOptions());
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
      const wrapper = shallowMount(NodeDialog, getOptions());
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
  });
});
