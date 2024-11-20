/* The methods exported by this test utility file can be used for testing components that are supposed to be used
 * within a JSONForms context.
 * A component can be mounted using composition API and the correct initialization of JSONForms can be verified on a
 * given vue test utils wrapper. */
import { expect, vi } from "vitest";
import { reactive, ref } from "vue";
import { mount } from "@vue/test-utils";
import { useJsonFormsArrayControl, useJsonFormsLayout } from "@jsonforms/vue";
import * as jsonformsVueModule from "@jsonforms/vue";

import { injectionKey as hasNodeViewInjectionKey } from "@/nodeDialog/composables/components/useHasNodeView";
import * as useJsonFormsControlWithUpdateModule from "@/nodeDialog/composables/components/useJsonFormsControlWithUpdate";
import { injectionKey as flowVarMapKey } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";
import { injectionKey as dirtySettingsInjectionKey } from "@/nodeDialog/composables/nodeDialog/useDirtySettings";
import { getPossibleValuesFromUiSchema } from "@/nodeDialog/utils";

import { createPersistSchema } from "./createPersistSchema";

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
    sendAlertMock,
    triggerMock,
    isTriggerActiveMock,
    asyncChoicesProviderMock,
    addStateProviderListenerMock,
    flowVariablesApiMock,
    persistSchemaMock,
    settingStateControllingGetMock,
    settingStateExposedGetMock,
    getPanelsContainerMock,
    getDialogPopoverTeleportDestMock,
    createArrayAtPathMock,
  } = provide;
  const updateData = vi.fn();
  const getData = getDataMock ?? vi.fn();
  const sendAlert = sendAlertMock ?? vi.fn();
  const trigger = triggerMock ?? vi.fn();
  const isTriggerActive =
    isTriggerActiveMock ?? vi.fn().mockResolvedValue({ state: "FAIL" });
  const asyncChoicesProvider = asyncChoicesProviderMock ?? vi.fn();
  const addStateProviderListener = addStateProviderListenerMock ?? vi.fn();
  const createArrayAtPath = createArrayAtPathMock ?? vi.fn(() => ({}));
  const flowVariablesApi = flowVariablesApiMock ?? {
    getFlowVariableOverrideValue: vi.fn(),
  };
  const getPanelsContainer = getPanelsContainerMock ?? vi.fn(() => "body");
  const getDialogPopoverTeleportDest =
    getDialogPopoverTeleportDestMock ?? vi.fn(() => "body");
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
  let handleChange = vi.fn();
  let defaultPersistSchema = null;
  if (props.control) {
    vi.spyOn(jsonformsVueModule, "useJsonFormsControl").mockReturnValue({
      handleChange,
      control: ref(props.control),
    });
    defaultPersistSchema = createPersistSchema({ path: props.control.path });
  }
  if (props.layout) {
    vi.spyOn(jsonformsVueModule, "useJsonFormsLayout").mockReturnValue({
      layout: props.layout,
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
        isTriggerActive,
        flowVariablesApi,
        [flowVarMapKey]: flowVariablesMap,
        [hasNodeViewInjectionKey]: ref(true),
        getPersistSchema: vi.fn(
          () => persistSchemaMock ?? defaultPersistSchema,
        ),
        getPanelsContainer,
        createArrayAtPath,
        getDialogPopoverTeleportDest,
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
    useJsonFormsControlSpy,
    sendAlert,
    getData,
    flowVariablesMap,
    handleChange,
    updateData,
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
  },
});
