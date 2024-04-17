import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  initializesJsonFormsControl,
  mountJsonFormsComponent,
  getControlBase,
} from "@@/test-setup/utils/jsonFormsTestUtils";
import ButtonInput from "../ButtonInput.vue";
import DialogComponentWrapper from "../DialogComponentWrapper.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import LoadingIcon from "webapps-common/ui/components/LoadingIcon.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import DialogLabel from "../label/DialogLabel.vue";
import flushPromises from "flush-promises";

describe("ButtonInput", () => {
  const states = [
    {
      id: "A",
      text: "Text_A",
      disabled: true,
      primary: true,
      nextState: "B",
    },
    {
      id: "B",
      text: "Text_B",
      disabled: false,
      primary: false,
      nextState: "C",
    },
    {
      id: "C",
      text: "Text_C",
    },
  ];

  const defaultOptions = {
    format: "button",
    states,
    displayErrorMessage: true,
    showTitleAndDescription: true,
    actionHandler: "MyActionHandlerClass",
  };
  const uischema = {
    type: "Control",
    scope: "#/properties/buttonInput",
    options: defaultOptions,
  };
  const schema = {
    properties: {
      buttonInput: {
        type: "string",
        title: "Test title",
      },
    },
  };

  const path = "test";

  const getProps = (uischemaOptions) => ({
    control: {
      ...getControlBase(path),
      schema,
      label: "Test title",
      uischema: {
        ...uischema,
        options: {
          format: "button",
          ...defaultOptions,
          ...uischemaOptions,
        },
      },
    },
  });

  const mountButtonInput = ({ props, getDataMock }) =>
    mountJsonFormsComponent(ButtonInput, { props, provide: { getDataMock } });

  let getDataResult, wrapper, props, component, getData;

  beforeEach(async () => {
    props = getProps(defaultOptions);
    vi.useFakeTimers();
    getDataResult = {
      state: "SUCCESS",
      result: {
        settingValue: "token",
        setSettingValue: true,
        buttonState: states[1].id,
      },
    };
    getData = vi.fn(() => getDataResult);
    component = await mountButtonInput({ props, getDataMock: getData });
    wrapper = component.wrapper;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("initializes jsonforms", () => {
    initializesJsonFormsControl(component);
  });

  const getButtonComponent = (wrapper) => {
    return wrapper
      .find(".button-wrapper")
      .findComponent(FunctionButton)
      .find("button");
  };

  it("sets labelForId", async () => {
    await wrapper.vm.$nextTick();
    const dialogLabel = wrapper.findComponent(DialogLabel);
    expect(getButtonComponent(wrapper).attributes().id).toBe(
      dialogLabel.vm.labelForId,
    );
    expect(dialogLabel.vm.labeledElement).toBeDefined().not.toBeNull();
  });

  describe("renders", () => {
    it("renders main components", () => {
      expect(
        wrapper.findComponent(DialogComponentWrapper).exists(),
      ).toBeTruthy();
      expect(getButtonComponent(wrapper).exists()).toBeTruthy();
      expect(wrapper.findComponent(Label).exists()).toBeTruthy();
    });

    it("shows loading spinner during loading", async () => {
      wrapper.vm.numPendingRequests = 1;
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
    });

    it("displays labeled input on default", () => {
      expect(wrapper.findComponent(Label).exists()).toBeTruthy();
      expect(wrapper.findComponent(Label).text()).contains("Test title");
    });

    it("does not render label if showTitleAndDescription is set to false", async () => {
      const hideTitleUischemaOptions = { showTitleAndDescription: false };
      props = getProps(hideTitleUischemaOptions);
      const { wrapper } = await mountButtonInput({
        props,
        getDataMock: getData,
      });
      expect(wrapper.findComponent(Label).exists()).toBeFalsy();
    });
  });

  describe("actions", () => {
    it("invokes action on click", async () => {
      const currentSettings = { foo: "bar" };
      wrapper.vm.currentSettings = currentSettings;
      await getButtonComponent(wrapper).trigger("click");
      expect(getData).toHaveBeenCalledWith({
        method: "settings.invokeButtonAction",
        options: [
          expect.anything(),
          uischema.options.actionHandler,
          states[1].id,
          currentSettings,
        ],
      });
    });

    it("sets next state specified in the uischema immediately", () => {
      getButtonComponent(wrapper).trigger("click");
      expect(wrapper.vm.currentState).toStrictEqual(states[2]);
    });

    it("sets next state specified by the returned value", async () => {
      const nextState = states[0];
      getData.mockImplementation(() => ({
        state: "SUCCESS",
        result: { buttonState: nextState.id },
      }));
      await getButtonComponent(wrapper).trigger("click");
      expect(wrapper.vm.currentState).toStrictEqual(nextState);
    });

    it("does not change the state if null is returned successfully", async () => {
      getData.mockImplementation(() => ({
        state: "SUCCESS",
        result: null,
      }));
      getButtonComponent(wrapper).trigger("click");
      const stateAfterClick = wrapper.vm.currentState;
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.currentState).toStrictEqual(stateAfterClick);
    });

    it("calls updateData if the result should be applied", async () => {
      getData.mockImplementation(() => ({
        state: "SUCCESS",
        result: {
          settingValue: "token",
          setSettingValue: true,
          buttonState: states[1].id,
        },
      }));
      await wrapper
        .findComponent(FunctionButton)
        .find("button")
        .trigger("click");
      vi.runAllTimers();
      expect(component.updateData).toHaveBeenCalledWith(
        expect.anything(),
        "test",
        "token",
      );
    });

    it("does not call handleChange if the result should not be applied", async () => {
      getData.mockImplementation(() => ({
        state: "SUCCESS",
        result: {
          settingValue: "token",
          setSettingValue: false,
          buttonState: states[1].id,
        },
      }));
      vi.runAllTimers();
      wrapper.vm.handleChange = vi.fn();
      await wrapper
        .findComponent(FunctionButton)
        .find("button")
        .trigger("click");
      vi.runAllTimers();
      expect(wrapper.vm.handleChange).not.toHaveBeenCalled();
    });
  });

  describe("errors", () => {
    const errorReult = {
      state: "FAIL",
      message: ["some error"],
      result: {
        buttonState: states[1].id,
        setSettingValue: false,
        settingValue: null,
      },
    };

    beforeEach(() => {
      getData.mockImplementation(() => errorReult);
    });

    it("displays error message on FAIL", async () => {
      await getButtonComponent(wrapper).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".button-wrapper").text()).contains(
        "Error: some error",
      );
    });

    it("displays no error message if displayErrorMessage is false", async () => {
      const noErrorUischema = { displayErrorMessage: false };
      props = getProps(noErrorUischema);
      const { wrapper } = await mountButtonInput({
        props,
        getDataMock: vi.fn(() => errorReult),
      });
      await wrapper
        .findComponent(FunctionButton)
        .find("button")
        .trigger("click");
      expect(wrapper.find(".button-wrapper").text()).not.contains(
        "Error: some error",
      );
    });

    it("clears error message on next update", async () => {
      await getButtonComponent(wrapper).trigger("click");
      expect(wrapper.find(".button-wrapper").text()).contains(
        "Error: some error",
      );
      getButtonComponent(wrapper).trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".button-wrapper").text()).not.contains(
        "Error: some error",
      );
    });
  });

  describe("dependencies to other settings", () => {
    let settingsChangeCallback, wrapper, dependencies, callbacks;

    const dependenciesUischema = ["foo", "bar"];

    beforeEach(() => {
      const props = getProps({ isCancelable: true });
      props.control.uischema.options.dependencies = dependenciesUischema;
      getData = vi.fn(() => getDataResult);
      const comp = mountButtonInput({ props, getDataMock: getData });
      wrapper = comp.wrapper;
      callbacks = comp.callbacks;
      settingsChangeCallback = callbacks[0].transformSettings;
      dependencies = callbacks[0].dependencies;
      wrapper.vm.cancel = vi.fn();
      wrapper.vm.handleChange = vi.fn();
    });

    it("registers one watcher", () => {
      expect(settingsChangeCallback).toBeDefined();
      expect(dependencies).toStrictEqual(dependenciesUischema);
      expect(callbacks.length).toBe(1);
    });

    it("unpacks new data to current settings", () => {
      settingsChangeCallback({ model: { foo: 2, bar: 1 }, view: { baz: 3 } });
      expect(wrapper.vm.currentSettings).toStrictEqual({
        foo: 2,
        bar: 1,
        baz: 3,
      });
    });
  });

  describe("updates triggered by other settings", () => {
    let settingsChangeCallback, wrapper, dependencies, callbacks, updateData;

    const dependenciesUpdateHandler = ["foo", "bar"];
    const updateHandler = "updateHandler";

    beforeEach(() => {
      const props = getProps({ isCancelable: true });
      props.control.uischema.options.updateOptions = {
        updateHandler,
        dependencies: dependenciesUpdateHandler,
      };
      getData = vi.fn(() => getDataResult);
      const comp = mountButtonInput({ props, getDataMock: getData });
      wrapper = comp.wrapper;
      callbacks = comp.callbacks;
      updateData = comp.updateData;
      settingsChangeCallback = callbacks[1].transformSettings;
      dependencies = callbacks[1].dependencies;
      wrapper.vm.cancel = vi.fn();
      wrapper.vm.handleChange = vi.fn();
    });

    it("registers one watcher", () => {
      expect(settingsChangeCallback).toBeDefined();
      expect(dependencies).toStrictEqual(dependenciesUpdateHandler);
      expect(callbacks.length).toBe(2);
    });

    it("applies new state defined by the update callback", async () => {
      const settingValue = "updateSettingResult";
      const nextState = states[0];
      getDataResult = {
        state: "SUCCESS",
        result: {
          settingValue,
          setSettingValue: true,
          buttonState: nextState.id,
        },
      };
      await settingsChangeCallback({
        model: { foo: 2, bar: 1 },
        view: { baz: 3 },
      });
      expect(getData).toHaveBeenCalledWith({
        method: "settings.update",
        options: [expect.anything(), updateHandler, { foo: 2, bar: 1, baz: 3 }],
      });
      vi.runAllTimers();
      await flushPromises();
      expect(wrapper.text()).toContain(nextState.text);
      expect(updateData).toHaveBeenCalledWith(
        expect.anything(),
        path,
        settingValue,
      );
    });
  });

  describe("reset current state", () => {
    it("resets current state after failed request on click", async () => {
      const nextState = states[0];
      getDataResult = {
        state: "FAIL",
        result: {
          buttonState: nextState.id,
        },
      };
      await wrapper
        .findComponent(FunctionButton)
        .find("button")
        .trigger("click");
      expect(wrapper.text()).toContain(states[1].text);
    });

    it("resets current state after canceled request on click", async () => {
      const nextState = states[0];
      getDataResult = {
        state: "CANCELED",
        result: {
          buttonState: nextState.id,
        },
      };
      await wrapper
        .findComponent(FunctionButton)
        .find("button")
        .trigger("click");
      expect(wrapper.text()).toContain(states[1].text);
    });
  });

  it("does not switch to next state on click when none exists", async () => {
    getDataResult.result.buttonState = states[2].id;
    getButtonComponent(wrapper).trigger("click");
    expect(wrapper.text()).toContain(states[1].text);
    await flushPromises();
    expect(wrapper.text()).toContain(states[2].text);
    getButtonComponent(wrapper).trigger("click");
    expect(wrapper.text()).toContain(states[2].text);
  });

  describe("current state", () => {
    const mountWithInitialState = async (initialState) => {
      const stateId = "myState";
      const result = {
        state: "SUCCESS",
        result: {
          settingValue: "token",
          setSettingValue: true,
          buttonState: stateId,
        },
      };
      const props = getProps({
        states: [
          {
            id: stateId,
            ...initialState,
          },
        ],
      });
      const { wrapper } = mountButtonInput({
        props,
        getDataMock: () => result,
      });
      await flushPromises();
      return wrapper;
    };

    it("disabled button if current state is disabled", async () => {
      const wrapper = await mountWithInitialState({ disabled: true });
      expect(getButtonComponent(wrapper).attributes().class).contains(
        "disabled",
      );
    });

    it("does not disabled button if current state is not disabled", async () => {
      const wrapper = await mountWithInitialState({ disabled: false });
      expect(getButtonComponent(wrapper).attributes().class).not.contains(
        "disabled",
      );
    });

    it("sets primary if current state is primary", async () => {
      const wrapper = await mountWithInitialState({ primary: true });
      expect(getButtonComponent(wrapper).attributes().class).contains(
        "primary",
      );
    });

    it("does not set primary if current state is not primary", async () => {
      const wrapper = await mountWithInitialState({ primary: false });
      expect(getButtonComponent(wrapper).attributes().class).not.contains(
        "primary",
      );
    });

    it("displays custom button texts", async () => {
      const text = "customText";
      const wrapper = await mountWithInitialState({ text });
      expect(wrapper.find(".button-input-text").text()).toBe(text);
    });
  });
});
