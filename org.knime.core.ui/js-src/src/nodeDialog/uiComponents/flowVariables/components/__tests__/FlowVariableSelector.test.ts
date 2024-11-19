/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dropdown } from "@knime/components";
import { mount } from "@vue/test-utils";
import {
  beforeEach,
  afterEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type MockInstance,
} from "vitest";
import flushPromises from "flush-promises";
import FlowVariableSelector from "../FlowVariableSelector.vue";
import type { FlowVariableSelectorProps } from "../../types/FlowVariableSelectorProps";
import { type ProvidedForFlowVariables } from "@/nodeDialog/types/provided";
import { type FlowSettings } from "@/nodeDialog/api/types";
import { injectionKey as providedByComponentKey } from "@/nodeDialog/composables/components/useFlowVariables";
import { injectionKey as flowVarMapKey } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";

type MockedMethods<T extends Record<string, (...args: any[]) => any>> = {
  [K in keyof T]?: MockInstance<T[K]>;
};

describe("FlowVariableSelector.vue", () => {
  let props: FlowVariableSelectorProps,
    flowVariablesMap: Record<string, FlowSettings>,
    setDirtyState: Mock,
    unsetDirtyState: Mock;

  beforeEach(() => {
    setDirtyState = vi.fn();
    unsetDirtyState = vi.fn();
    flowVariablesMap = {};
    props = {
      dataPath: "model.myPath",
      persistPath: "persist.path.to.setting",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const mountFlowVariableSelector = ({
    props,
    getAvailableFlowVariables,
    getFlowVariableOverrideValue,
    clearControllingFlowVariable,
  }: {
    props: FlowVariableSelectorProps;
  } & MockedMethods<ProvidedForFlowVariables["flowVariablesApi"]>) => {
    return mount(FlowVariableSelector as any, {
      props,
      global: {
        provide: {
          [providedByComponentKey as symbol]: {
            settingStateFlowVariables: {
              controlling: {
                get: () => ({
                  set: setDirtyState,
                  unset: unsetDirtyState,
                }),
              },
            },
          },
          [flowVarMapKey as symbol]: flowVariablesMap,
          flowVariablesApi: {
            getAvailableFlowVariables:
              getAvailableFlowVariables ||
              vi.fn((_path) => Promise.resolve({})),
            getFlowVariableOverrideValue:
              getFlowVariableOverrideValue ||
              vi.fn((_flowVar) => Promise.resolve("value")),
            clearControllingFlowVariable:
              clearControllingFlowVariable || vi.fn(),
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
      ariaLabel: "controlling-flow-variables-persist.path.to.setting",
      modelValue: "",
      placeholder: "No suitable flow variable present",
      disabled: true,
    });
  });

  it("does not disable the control if there is a value set", async () => {
    const flowVariableName = "myVariable";
    flowVariablesMap[props.persistPath] = {
      controllingFlowVariableName: flowVariableName,
      controllingFlowVariableAvailable: false,
      exposedFlowVariableName: null,
    };
    const wrapper = mountFlowVariableSelector({ props });
    expect(wrapper.findComponent(Dropdown).exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      modelValue: flowVariableName,
      disabled: false,
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
    expect(getAvailableFlowVariablesMock).toHaveBeenCalledWith(
      props.persistPath,
    );
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      modelValue: "",
      placeholder: "Fetching available flow variables...",
      disabled: true,
    });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props()).toMatchObject({
      possibleValues: [
        {
          id: "",
          text: "None",
          title: "No flow variable selected",
        },
        constructPossibleValue("var1"),
        constructPossibleValue("var2"),
        constructPossibleValue("var3"),
      ],
      placeholder: "No flow variable selected",
    });
  });

  it("sets the initial model value", async () => {
    const varName = "var";
    flowVariablesMap[props.persistPath] = {
      controllingFlowVariableName: varName,
      controllingFlowVariableAvailable: true,
      exposedFlowVariableName: null,
    };
    const wrapper = mountFlowVariableSelector({ props });
    await flushPromises();
    expect(wrapper.findComponent(Dropdown).props().modelValue).toBe(varName);
    expect(setDirtyState).not.toHaveBeenCalled();
  });

  it("sets controlling flow variable on selection", async () => {
    const flowVarValue = "Value_fetched_from_backend";
    const getFlowVariableOverrideValueMock = vi.fn((_persistPath, _dataPath) =>
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
    expect(flowVariablesMap[props.persistPath]).toStrictEqual({
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: flowVar2.name,
    });
    expect(getFlowVariableOverrideValueMock).toHaveBeenCalledWith(
      props.persistPath,
      props.dataPath,
    );
    expect(wrapper.emitted("controllingFlowVariableSet")?.[0]?.[0]).toBe(
      flowVarValue,
    );
    expect(setDirtyState).toHaveBeenCalledWith(flowVar2.name);
  });

  it("sets flawed controlling flow variable", async () => {
    const getFlowVariableOverrideValueMock = vi.fn((_persistPath, _dataPath) =>
      Promise.resolve(undefined),
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
    expect(flowVariablesMap[props.persistPath]).toStrictEqual({
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: flowVar2.name,
    });
    expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
    expect(setDirtyState).toHaveBeenCalledWith(flowVar2.name, {
      isFlawed: true,
    });
  });

  it("unsets controlling flow variable on none selection", async () => {
    const exposedFlowVariableName = "exposed";
    flowVariablesMap[props.dataPath] = {
      controllingFlowVariableAvailable: true,
      controllingFlowVariableName: "foo",
      exposedFlowVariableName,
    };
    const clearControllingFlowVariableMock = vi.fn((_persistPath) => {});
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
      clearControllingFlowVariable: clearControllingFlowVariableMock,
    });
    await flushPromises();
    const noneOption = wrapper.findComponent(Dropdown).find("li");
    await noneOption.trigger("click");
    expect(clearControllingFlowVariableMock).toHaveBeenCalledWith(
      props.persistPath,
    );
    expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
    expect(unsetDirtyState).toHaveBeenCalled();
  });

  it("does nothing when unsetting flow variable if none was set", async () => {
    const wrapper = mountFlowVariableSelector({
      props,
      getAvailableFlowVariables: getAvailableFlowVariablesMock,
    });
    await flushPromises();
    const noneOption = wrapper.findComponent(Dropdown).find("li");
    await noneOption.trigger("click");
    expect(flowVariablesMap[props.dataPath]).toBeUndefined();
    expect(wrapper.emitted("controllingFlowVariableSet")).toBeUndefined();
  });
});
