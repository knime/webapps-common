import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { Dropdown } from "@knime/components";

import {
  getControlBase,
  initializesJsonFormsControl,
  mountJsonFormsComponent,
} from "../../../test-setup/utils/jsonFormsTestUtils";
import DropdownControl from "../DropdownControl.vue";
import DialogLabel from "../label/DialogLabel.vue";
import LabeledControl from "../label/LabeledControl.vue";

describe("DropdownControl.vue", () => {
  let wrapper, props, component;

  const path = "test";

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase(path),
        data: "Universe_0_0",
        schema: {
          title: "Y Axis Column",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/view/properties/yAxisColumn",
          options: {
            format: "columnSelection",
            showRowKeys: false,
            showNoneColumn: false,
            possibleValues: [
              {
                id: "Universe_0_0",
                text: "Universe_0_0",
              },
              {
                id: "Universe_0_1",
                text: "Universe_0_1",
              },
              {
                id: "Universe_1_0",
                text: "Universe_1_0",
              },
              {
                id: "Universe_1_1",
                text: "Universe_1_1",
              },
            ],
          },
        },
      },
    };
    component = await mountJsonFormsComponent(DropdownControl, {
      props,
      withControllingFlowVariable: true,
    });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.getComponent(DropdownControl).exists()).toBe(true);
    expect(wrapper.findComponent(LabeledControl).exists()).toBe(true);
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(wrapper.getComponent(Dropdown).props().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined();
    expect(dialogLabel.vm.labeledElement).not.toBeNull();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  describe("reacts to dropdown input change", () => {
    let setDirtyModelSettingsMock;

    beforeEach(() => {
      setDirtyModelSettingsMock = vi.fn();
    });

    afterEach(() => {
      vi.clearAllMocks();
    });

    it("calls handleChange when input is changed", async () => {
      const { wrapper, handleChange } = await mountJsonFormsComponent(
        DropdownControl,
        { props, provide: { setDirtyModelSettingsMock } },
      );
      const changedDropdownControl = "Shaken not stirred";
      wrapper
        .findComponent(Dropdown)
        .vm.$emit("update:modelValue", changedDropdownControl);
      expect(handleChange).toHaveBeenCalledWith(
        props.control.path,
        changedDropdownControl,
      );
      expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
    });
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets correct label", () => {
    expect(wrapper.find("label").text()).toBe(props.control.label);
  });

  it("sets placeholder text correctly if possible values are not yet available", async () => {
    props.control.uischema.options.possibleValues = [];
    props.asyncInitialOptions = new Promise((_resolve) => {});
    const { wrapper } = mountJsonFormsComponent(DropdownControl, { props });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe("Loading");
  });

  it("sets placeholder text correctly if possible values are empty", async () => {
    props.control.uischema.options.possibleValues = [];
    const { wrapper } = mountJsonFormsComponent(DropdownControl, { props });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No values present",
    );
  });

  it("sets placeholder text correctly if there are possible values present", async () => {
    props.control.data = "";
    const { wrapper } = mountJsonFormsComponent(DropdownControl, { props });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No value selected",
    );
  });

  it("disables dropdown when controlled by a flow variable", () => {
    expect(wrapper.vm.disabled).toBeTruthy();
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  it("does not disable dropdown when not controlled by a flow variable", async () => {
    delete props.control.rootSchema.flowVariablesMap;
    const { wrapper } = await mountJsonFormsComponent(DropdownControl, {
      props,
    });
    await flushPromises();
    expect(wrapper.vm.disabled).toBeFalsy();
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeFalsy();
  });

  it("disables dropdown when there are no possible values", async () => {
    props.control.uischema.options.possibleValues = [];
    const { wrapper } = await mountJsonFormsComponent(DropdownControl, {
      props,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  describe("dependencies to other settings", () => {
    let settingsChangeCallback,
      initialSettingsChangeCallback,
      wrapper,
      dependencies,
      getDataMock,
      sendAlert,
      unregisterWatcher,
      newSettings;

    const dependenciesUiSchema = ["foo", "bar"];
    const result = [
      { id: "first", text: "First" },
      { id: "second", text: "Second" },
    ];
    const updateHandler = "UpdateHandler";
    const valueBeforeUpdate = "settingsBefore";

    beforeEach(() => {
      newSettings = {
        view: { foo: "foo", bar: "bar" },
        model: { baz: "baz" },
        [path]: valueBeforeUpdate,
      };
      props.control.uischema.options.dependencies = dependenciesUiSchema;
      props.control.uischema.options.choicesUpdateHandler = updateHandler;
      props.control.uischema.options.setFirstValueOnUpdate = true;
      getDataMock = vi.fn(() => {
        return {
          result,
          state: "SUCCESS",
          message: null,
        };
      });
      const comp = mountJsonFormsComponent(DropdownControl, {
        props,
        provide: { getDataMock },
      });
      wrapper = comp.wrapper;
      sendAlert = comp.sendAlert;

      const callbacks = comp.callbacks;
      const firstWatcherCall = callbacks[0];
      unregisterWatcher = comp.unregisterWatcher;
      settingsChangeCallback = firstWatcherCall.transformSettings;
      initialSettingsChangeCallback = firstWatcherCall.init;
      dependencies = firstWatcherCall.dependencies;
      wrapper.vm.cancel = vi.fn();
    });

    it("registers watcher", () => {
      expect(settingsChangeCallback).toBeDefined();
      expect(dependencies).toStrictEqual(dependenciesUiSchema);
    });

    it("deregisters watcher on unmount", () => {
      wrapper.unmount();
      expect(unregisterWatcher).toHaveBeenCalled();
    });

    it("requests new data if dependencies change", () => {
      settingsChangeCallback({
        view: { foo: "foo", bar: "bar" },
        model: { baz: "baz" },
      });
      expect(getDataMock).toHaveBeenCalledWith({
        method: "settings.update",
        options: [
          expect.anything(),
          updateHandler,
          {
            foo: "foo",
            bar: "bar",
            baz: "baz",
          },
        ],
      });
    });

    it("sets new options and selected the first option", async () => {
      (await settingsChangeCallback(newSettings))(newSettings);
      expect(wrapper.vm.options).toStrictEqual(result);
      expect(newSettings[path]).toBe(result[0].id);
    });

    it("sets new options without changing the data on the initial update", async () => {
      initialSettingsChangeCallback(newSettings);
      await flushPromises();
      expect(wrapper.vm.options).toStrictEqual(result);
      expect(newSettings[path]).toBe(valueBeforeUpdate);
    });

    it("selects null if the fetched options are empty", async () => {
      getDataMock.mockImplementation(() => ({
        result: [],
        state: "SUCCESS",
        message: null,
      }));
      (await settingsChangeCallback(newSettings))(newSettings);
      expect(wrapper.vm.options).toStrictEqual([]);
      expect(newSettings[path]).toBeNull();
    });

    it("does not change the value if setFirstValueOnUpdate is false", async () => {
      props.control.uischema.options.setFirstValueOnUpdate = false;
      const { callbacks } = mountJsonFormsComponent(DropdownControl, {
        props,
        provide: { getDataMock },
      });

      const firstWatcherCall = callbacks[0];
      const settingsChangeCallback = firstWatcherCall.transformSettings;

      settingsChangeCallback(newSettings);
      await flushPromises();
      expect(newSettings[path]).toBe(valueBeforeUpdate);
    });

    it("does change the value even if setFirstValueOnUpdate is false if the previous value is falsy", async () => {
      props.control.uischema.options.setFirstValueOnUpdate = false;
      props.control.data = null;
      const { callbacks } = mountJsonFormsComponent(DropdownControl, {
        props,
        provide: { getDataMock },
      });

      const firstWatcherCall = callbacks[0];
      const settingsChangeCallback = firstWatcherCall.transformSettings;

      (await settingsChangeCallback(newSettings))(newSettings);
      expect(newSettings[path]).toBe(result[0].id);
    });

    it("sets empty options and warns about error on state FAIL", async () => {
      const message = "Error message";
      getDataMock.mockImplementation(() => ({
        result: null,
        state: "FAIL",
        message: [message],
      }));
      (await settingsChangeCallback(newSettings))(newSettings);
      expect(wrapper.vm.options).toStrictEqual([]);
      expect(newSettings[path]).toBeNull();
      expect(sendAlert).toHaveBeenCalledWith({
        message,
        type: "error",
      });
    });
  });

  it("sets initial options if provided", async () => {
    const customOptions = [{ id: "foo", text: "bar" }];
    props.asyncInitialOptions = Promise.resolve(customOptions);
    const { wrapper } = mountJsonFormsComponent(DropdownControl, { props });
    await flushPromises();
    expect(wrapper.vm.options).toStrictEqual(customOptions);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options.choicesProvider = choicesProvider;

    let provideChoices;
    const addStateProviderListenerMock = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsComponent(DropdownControl, {
      props,
      provide: { addStateProviderListenerMock },
    });
    expect(addStateProviderListenerMock).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices(providedChoices);
    /**
     * TODO: UIEXT-1401 remove flushPromises here (see getPossibleValuesFromUiSchema)
     */
    await flushPromises();
    expect(wrapper.vm.options).toStrictEqual(providedChoices);
  });
});
