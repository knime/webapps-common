/* The methods exported by this test utility file can be used for testing components that are supposed to be used
 * within a JSONForms context.
 * A component can be mounted using composition API and the correct initialization of JSONForms can be verified on a
 * given vue test utils wrapper. */
import { expect, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { useJsonFormsLayout, useJsonFormsArrayControl } from "@jsonforms/vue";

import * as useJsonFormsControlWithUpdateModule from "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate";
import { injectionKey as dirtySettingsInjectionKey } from "@/nodeDialog/composables/nodeDialog/useDirtySettings";
import * as jsonformsVueModule from "@jsonforms/vue";

import { getPossibleValuesFromUiSchema } from "@/nodeDialog/utils";
import { reactive, ref } from "vue";

export const mountJsonFormsComponent = (
  component,
  {
    props = {},
    provide = {},
    showAdvanced = false,
    withControllingFlowVariable = false,
    stubs = {},
  } = {},
) => {
  const useJsonFormsControlSpy = vi.spyOn(
    useJsonFormsControlWithUpdateModule,
    "useJsonFormsControlWithUpdate",
  );
  const callbacks = [];
  const {
    getDataMock,
    updateDataMock,
    sendAlertMock,
    triggerMock,
    asyncChoicesProviderMock,
    addStateProviderListenerMock,
    flowVariablesApiMock,
    settingStateControllingGetMock,
    settingStateExposedGetMock,
    getPanelsContainerMock,
  } = provide;
  const updateData =
    updateDataMock ||
    vi.fn((handleChange, path, value) => handleChange(path, value));
  const getData = getDataMock ?? vi.fn();
  const sendAlert = sendAlertMock ?? vi.fn();
  const trigger = triggerMock ?? vi.fn();
  const asyncChoicesProvider = asyncChoicesProviderMock ?? vi.fn();
  const addStateProviderListener = addStateProviderListenerMock ?? vi.fn();
  const flowVariablesApi = flowVariablesApiMock ?? {
    getFlowVariableOverrideValue: vi.fn(),
  };
  const getPanelsContainer = getPanelsContainerMock ?? vi.fn(() => "body");
  const flowVariablesMap = reactive(
    withControllingFlowVariable
      ? {
          [typeof withControllingFlowVariable === "string"
            ? withControllingFlowVariable
            : props.control.path]: {
            controllingFlowVariableAvailable: true,
            controllingFlowVariableName: "knime.test",
          },
        }
      : {},
  );
  if (props.control) {
    vi.spyOn(jsonformsVueModule, "useJsonFormsControl").mockReturnValue({
      handleChange: vi.fn(),
      control: ref(props.control),
    });
  }
  const settingState = {
    setValue: (..._args2) => {},
    flowVariables: {
      controlling: {
        get:
          settingStateControllingGetMock ??
          vi.fn(() => ({
            set: vi.fn(),
            unset: vi.fn(),
          })),
      },
      exposed: {
        get:
          settingStateExposedGetMock ??
          vi.fn(() => ({
            set: vi.fn(),
            unset: vi.fn(),
          })),
      },
    },
  };
  const unregisterWatcher = vi.fn();
  const wrapper = mount(component, {
    props,
    global: {
      provide: {
        getKnimeService: () => ({
          getConfig: () => ({
            nodeId: "nodeId",
          }),
        }),
        registerWatcher: ({ transformSettings, init, dependencies }) => {
          callbacks.push({ transformSettings, init, dependencies });
          if (typeof init === "function") {
            init({});
          }
          return unregisterWatcher;
        },
        [dirtySettingsInjectionKey]: {
          getSettingState: (..._args) => settingState,
          constructSettingState: (..._args) => settingState,
        },
        getPossibleValuesFromUiSchema: (control) =>
          getPossibleValuesFromUiSchema(control, asyncChoicesProvider),
        updateData,
        getData,
        sendAlert,
        addStateProviderListener,
        trigger,
        flowVariablesApi,
        getFlowVariablesMap: () => flowVariablesMap,
        getPanelsContainer,
        setSubPanelExpanded: vi.fn(),
      },
      stubs: {
        DispatchRenderer: true,
        ...stubs,
      },
    },
    provide: {
      jsonforms: {
        core: {
          schema: {
            showAdvancedSettings: showAdvanced,
          },
        },
      },
    },
  });
  return {
    wrapper,
    callbacks,
    unregisterWatcher,
    updateData,
    useJsonFormsControlSpy,
    sendAlert,
    getData,
    flowVariablesMap,
  };
};

const hasBasicProps = (props) => {
  expect(props.hasOwnProperty("schema")).toBe(true);
  expect(props.hasOwnProperty("uischema")).toBe(true);
  expect(props.hasOwnProperty("path")).toBe(true);
};

export const initializesJsonFormsControl = ({
  wrapper,
  useJsonFormsControlSpy,
}) => {
  const props = wrapper.props();
  hasBasicProps(props);
  expect(props.hasOwnProperty("control")).toBe(true);
  expect(props.control.schema).toBeDefined();
  expect(props.control.uischema).toBeDefined();
  expect(useJsonFormsControlSpy).toHaveBeenCalled();
};

export const initializesJsonFormsLayout = (wrapper) => {
  const props = wrapper.props();
  hasBasicProps(props);
  expect(props.hasOwnProperty("layout")).toBe(true);
  expect(props.layout.schema).toBeDefined();
  expect(props.layout.uischema).toBeDefined();
  expect(useJsonFormsLayout).toHaveBeenCalled();
};

export const initializesJsonFormsArrayControl = (wrapper) => {
  const props = wrapper.props();
  hasBasicProps(props);
  expect(props.hasOwnProperty("control")).toBe(true);
  expect(props.control.schema).toBeDefined();
  expect(props.control.uischema).toBeDefined();
  expect(useJsonFormsArrayControl).toHaveBeenCalled();
};

export const getControlBase = (path) => ({
  path,
  enabled: true,
  visible: true,
  label: "defaultLabel",
  rootSchema: {
    type: "object",
    properties: {
      [path]: {},
    },
    hasNodeView: true,
    flowVariablesMap: {},
  },
});
