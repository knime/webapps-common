import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";

import { Dropdown } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControl,
} from "../../../testUtils/component";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import type { Control } from "../../types/Control";
import DropdownControl from "../DropdownControl.vue";

describe("DropdownControl.vue", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof DropdownControl>,
    changeValue: Mock;

  const path = "test";

  const getPossibleValuesFromUiSchema = vi.fn((control: Control) => {
    return Promise.resolve(control.uischema.options!.possibleValues);
  });

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
      disabled: false,
      isValid: false,
      messages: { errors: [] },
    };
    const component = await mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    wrapper = component.wrapper;
    changeValue = component.changeValue;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders", () => {
    expect(wrapper.findComponent(Dropdown).exists()).toBe(true);
  });

  it("sets labelForId", () => {
    expect(wrapper.getComponent(Dropdown).props().id).toBeDefined();
  });

  it("calls handleChange when input is changed", () => {
    const changedDropdownControl = "Shaken not stirred";
    wrapper
      .findComponent(Dropdown)
      .vm.$emit("update:modelValue", changedDropdownControl);
    expect(changeValue).toHaveBeenCalledWith(changedDropdownControl);
  });

  it("sets correct initial value", () => {
    expect(wrapper.findComponent(Dropdown).vm.modelValue).toBe(
      props.control.data,
    );
  });

  it("sets placeholder text correctly if possible values are not yet available", async () => {
    props.control.uischema.options!.possibleValues = [];
    props.asyncInitialOptions = new Promise(() => {});
    const { wrapper } = mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe("Loading");
  });

  it("sets placeholder text correctly if possible values are empty", async () => {
    props.control.uischema.options!.possibleValues = [];
    const { wrapper } = mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No values present",
    );
  });

  it("sets placeholder text correctly if there are possible values present", async () => {
    props.control.data = "";
    const { wrapper } = mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().placeholder).toBe(
      "No value selected",
    );
  });

  it("disables dropdown by prop", async () => {
    await wrapper.setProps({ disabled: true });
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  it("disables dropdown when there are no possible values", async () => {
    props.control.uischema.options!.possibleValues = [];
    const { wrapper } = await mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).vm.disabled).toBeTruthy();
  });

  describe("dependencies to other settings", () => {
    let settingsChangeCallback: any,
      initialSettingsChangeCallback: any,
      wrapper: VueWrapper<any>,
      dependencies: string[],
      getData: Mock,
      sendAlert: Mock,
      unregisterWatcher: Mock,
      newSettings: any;

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
      props.control.uischema.options!.dependencies = dependenciesUiSchema;
      props.control.uischema.options!.choicesUpdateHandler = updateHandler;
      props.control.uischema.options!.setFirstValueOnUpdate = true;
      getData = vi.fn(() => {
        return {
          result,
          state: "SUCCESS",
          message: null,
        };
      });
      sendAlert = vi.fn();

      const callbacks: {
        transformSettings: any;
        init: any;
        dependencies: any;
      }[] = [];
      unregisterWatcher = vi.fn();
      const registerWatcher = vi.fn(
        ({ transformSettings, init, dependencies }: any) => {
          callbacks.push({ transformSettings, init, dependencies });
          if (typeof init === "function") {
            init({});
          }
          return unregisterWatcher;
        },
      );
      const comp = mountJsonFormsControl(DropdownControl, {
        props,
        provide: {
          // @ts-expect-error
          getData,
          getPossibleValuesFromUiSchema,
          sendAlert,
          registerWatcher,
        },
      });
      wrapper = comp.wrapper;

      const firstWatcherCall = callbacks[0];
      settingsChangeCallback = firstWatcherCall.transformSettings;
      initialSettingsChangeCallback = firstWatcherCall.init;
      dependencies = firstWatcherCall.dependencies;
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
      expect(getData).toHaveBeenCalledWith({
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
      getData.mockImplementation(() => ({
        result: [],
        state: "SUCCESS",
        message: null,
      }));
      (await settingsChangeCallback(newSettings))(newSettings);
      expect(wrapper.vm.options).toStrictEqual([]);
      expect(newSettings[path]).toBeNull();
    });

    it("does not change the value if setFirstValueOnUpdate is false", async () => {
      props.control.uischema.options!.setFirstValueOnUpdate = false;
      const callbacks: any[] = [];
      mountJsonFormsControl(DropdownControl, {
        props,
        provide: {
          // @ts-expect-error
          getData,
          registerWatcher: vi.fn(({ transformSettings }) => {
            callbacks.push({ transformSettings });
            return vi.fn();
          }),
        },
      });

      const firstWatcherCall = callbacks[0];
      const settingsChangeCallback = firstWatcherCall.transformSettings;

      settingsChangeCallback(newSettings);
      await flushPromises();
      expect(newSettings[path]).toBe(valueBeforeUpdate);
    });

    it("does change the value even if setFirstValueOnUpdate is false if the previous value is falsy", async () => {
      props.control.uischema.options!.setFirstValueOnUpdate = false;
      props.control.data = null;
      const callbacks: any[] = [];
      mountJsonFormsControl(DropdownControl, {
        props,
        provide: {
          // @ts-expect-error
          registerWatcher: vi.fn(({ transformSettings }) => {
            callbacks.push({ transformSettings });
            return vi.fn();
          }),
          getData,
          getPossibleValuesFromUiSchema,
        },
      });

      const firstWatcherCall = callbacks[0];
      const settingsChangeCallback = firstWatcherCall.transformSettings;

      (await settingsChangeCallback(newSettings))(newSettings);
      expect(newSettings[path]).toBe(result[0].id);
    });

    it("sets empty options and warns about error on state FAIL", async () => {
      const message = "Error message";
      getData.mockImplementation(() => ({
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
    const { wrapper } = mountJsonFormsControl(DropdownControl, {
      props,
      provide: {
        // @ts-expect-error
        getPossibleValuesFromUiSchema,
      },
    });
    await flushPromises();
    expect(
      wrapper.findComponent(Dropdown).props().possibleValues,
    ).toStrictEqual(customOptions);
  });

  it("uses choicesProvider if present", async () => {
    const choicesProvider = "myChoicesProvider";
    props.control.uischema.options!.choicesProvider = choicesProvider;

    let provideChoices: (choices: IdAndText[]) => void;
    const addStateProviderListener = vi.fn((_id, callback) => {
      provideChoices = callback;
    });
    const { wrapper } = mountJsonFormsControl(DropdownControl, {
      props,
      provide: { addStateProviderListener },
    });
    expect(addStateProviderListener).toHaveBeenCalledWith(
      { id: choicesProvider },
      expect.anything(),
    );
    const providedChoices = [
      {
        id: "Universe_0_0",
        text: "Universe_0_0",
      },
    ];
    provideChoices!(providedChoices);
    /**
     * TODO: UIEXT-1401 remove flushPromises here (see getPossibleValuesFromUiSchema)
     */
    await flushPromises();
    expect(
      wrapper.findComponent(Dropdown).props().possibleValues,
    ).toStrictEqual(providedChoices);
  });
});
