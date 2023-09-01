/* eslint-disable @typescript-eslint/no-unused-vars */
import type Provided from "@/nodeDialog/types/provided";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import MulitpleConfigKeysNotYetSupported from "../MultipleConfigKeysNotYetSupported.vue";
import { mount } from "@vue/test-utils";
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
} from "vitest";
import flushPromises from "flush-promises";

import FlowVariableSelector from "../FlowVariableSelector.vue";
import type FlowVariableSelectorProps from "../types/FlowVariableSelectorProps";

type MockedMethods<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]?: Mock<Parameters<T[K]>, ReturnType<T[K]>>;
};

describe("FlowVariableSelector.vue", () => {
  let props: FlowVariableSelectorProps;

  beforeEach(() => {
    props = {
      flowVariablesMap: {},
      path: "model.myPath",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountFlowVariableSelector = ({
    props,
    getAvailableFlowVariables,
    getFlowVariableOverrideValue,
  }: {
    props: FlowVariableSelectorProps;
  } & MockedMethods<Provided["flowVariablesApi"]>) => {
    return mount(FlowVariableSelector as any, {
      props,
      global: {
        provide: {
          flowVariablesApi: {
            getAvailableFlowVariables:
              getAvailableFlowVariables ||
              vi.fn((_path) => Promise.resolve({})),
            getFlowVariableOverrideValue:
              getFlowVariableOverrideValue ||
              vi.fn((_flowVar) => Promise.resolve("value")),
          },
        },
      },
    });
  };

  it("renders empty options", async () => {
    const wrapper = mountFlowVariableSelector({ props });
    expect(wrapper.findComponent(Dropdown).exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      ariaLabel: "controlling-flow-variables-model.myPath",
      modelValue: "",
      placeholder: "No suitable variable present",
      disabled: true,
    });
  });

  const constructValue = (name: string) => `${name}_test_value`;

  const constructFlowVar = (name: string) => {
    return {
      name,
      value: constructValue(name),
      abbreviated: false,
    };
  };

  const constructPossibleValue = (name: string) => {
    return {
      id: name,
      text: name,
      title: `${name} (currently "${constructValue(name)}")`,
    };
  };

  const flowVar1 = constructFlowVar("var1");
  const flowVar2 = constructFlowVar("var2");
  const flowVar3 = constructFlowVar("var3");
  const getAvailableFlowVariablesMock = vi.fn((_path) =>
    Promise.resolve({ STRING: [flowVar1, flowVar2], BOOLEAN: [flowVar3] }),
  );

  it("fetches the possible values", async () => {
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
    });
    expect(getAvailableFlowVariablesMock).toHaveBeenCalledWith(props.path);
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      modelValue: "",
      placeholder: "Fetching available flow variables...",
      disabled: true,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      possibleValues: [
        {
          id: 0,
          text: " ",
          title: "No controlling variable",
        },
        constructPossibleValue("var1"),
        constructPossibleValue("var2"),
        constructPossibleValue("var3"),
      ],
      placeholder: "No flow variable selected",
    });
    expect(wrapper.findComponent(Dropdown).props().possibleValues);
  });

  it("sets the initial model value", async () => {
    const varName = "var";
    props.flowSettings = {
      controllingFlowVariableName: varName,
      controllingFlowVariableAvailable: true,
      exposedFlowVariableName: null,
    };
    const wrapper = mountFlowVariableSelector({ props });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().modelValue).toBe(varName);
  });

  it("sets controlling flow variable on selection", async () => {
    const flowVarValue = "Value_fetched_from_backend";
    const getFlowVariableOverrideValueMock = vi.fn((_flowVar) =>
      Promise.resolve(flowVarValue),
    );
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
      getFlowVariableOverrideValue: getFlowVariableOverrideValueMock,
    });
    await flushPromises();
    const scondFlowVariableOptionElement = wrapper
      .findComponent(Dropdown)
      .findAll("li")
      .find((li) => li.text() === flowVar2.name)!;
    await scondFlowVariableOptionElement.trigger("click");
    expect(props.flowVariablesMap[props.path]).toStrictEqual({
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: flowVar2.name,
    });
    expect(getFlowVariableOverrideValueMock).toHaveBeenCalledWith(props.path);
    expect(wrapper.emitted("controllingFlowVariableSet")?.[0]?.[0]).toBe(
      flowVarValue,
    );
  });

  it("unsets controlling flow variable on none selection", async () => {
    const exposedFlowVariableName = "exposed";
    props.flowVariablesMap[props.path] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "foo",
      exposedFlowVariableName,
    };
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
    });
    await flushPromises();
    const noneOption = wrapper.findComponent(Dropdown).find("li");
    await noneOption.trigger("click");
    expect(props.flowVariablesMap[props.path]).toStrictEqual({
      controllingFlowVariableAvailable: false,
      controllingFlowVariableName: null,
      exposedFlowVariableName,
    });
    expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
  });

  it("does nothing when unsetting flow variable if none was set", async () => {
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
    });
    await flushPromises();
    const noneOption = wrapper.findComponent(Dropdown).find("li");
    await noneOption.trigger("click");
    expect(props.flowVariablesMap[props.path]).toBeUndefined();
    expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
  });

  describe("configKeys", () => {
    it("fetches the possible values using config key", () => {
      props.path = "path.to.parent.value";
      props.configKeys = ["myConfigKey"];
      mountFlowVariableSelector({
        props,
        getAvailableFlowVariables: getAvailableFlowVariablesMock,
      });
      expect(getAvailableFlowVariablesMock).toHaveBeenCalledWith(
        "path.to.parent.myConfigKey",
      );
    });

    it("does not fetch values in case of multiple config keys", () => {
      props.configKeys = ["myConfigKey1", "myConfigKey2"];
      const wrapper = mountFlowVariableSelector({
        props,
        getAvailableFlowVariables: getAvailableFlowVariablesMock,
      });
      expect(getAvailableFlowVariablesMock).not.toHaveBeenCalled();
      expect(
        wrapper.findComponent(MulitpleConfigKeysNotYetSupported).exists(),
      ).toBeTruthy();
      const message = wrapper
        .findComponent(MulitpleConfigKeysNotYetSupported)
        .text();
      expect(message).toContain(props.configKeys[0]);
      expect(message).toContain(props.configKeys[1]);
    });

    it("sets controlling flow variable using config key", async () => {
      props.path = "path.to.parent.value";
      props.configKeys = ["myConfigKey"];
      const flowVarValue = "Value_fetched_from_backend";
      const getFlowVariableOverrideValueMock = vi.fn((_flowVar) =>
        Promise.resolve(flowVarValue),
      );
      const wrapper = mountFlowVariableSelector({
        props,
        getAvailableFlowVariables: getAvailableFlowVariablesMock,
        getFlowVariableOverrideValue: getFlowVariableOverrideValueMock,
      });
      await flushPromises();
      const scondFlowVariableOptionElement = wrapper
        .findComponent(Dropdown)
        .findAll("li")
        .find((li) => li.text() === flowVar2.name)!;
      await scondFlowVariableOptionElement.trigger("click");
      expect(
        props.flowVariablesMap["path.to.parent.myConfigKey"],
      ).toStrictEqual({
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: flowVar2.name,
      });
      expect(getFlowVariableOverrideValueMock).toHaveBeenCalledWith(props.path);
      expect(wrapper.emitted("controllingFlowVariableSet")?.[0]?.[0]).toBe(
        flowVarValue,
      );
    });

    it("unsets controlling flow variable on none selection using config key", async () => {
      props.path = "path.to.parent.value";
      props.configKeys = ["myConfigKey"];
      const exposedFlowVariableName = "exposed";
      props.flowVariablesMap["path.to.parent.myConfigKey"] = {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "foo",
        exposedFlowVariableName,
      };
      const wrapper = mountFlowVariableSelector({
        props,
        getAvailableFlowVariables: getAvailableFlowVariablesMock,
      });
      await flushPromises();
      const noneOption = wrapper.findComponent(Dropdown).find("li");
      await noneOption.trigger("click");
      expect(
        props.flowVariablesMap["path.to.parent.myConfigKey"],
      ).toStrictEqual({
        controllingFlowVariableAvailable: false,
        controllingFlowVariableName: null,
        exposedFlowVariableName,
      });
      expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
    });
  });
});
