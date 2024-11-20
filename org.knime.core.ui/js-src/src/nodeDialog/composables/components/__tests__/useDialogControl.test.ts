import {
  type Mock,
  type MockInstance,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { type Ref, ref } from "vue";
import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import type { FlowSettings } from "@/nodeDialog/api/types/index";
import { injectionKey as injectionKeyHasNodeView } from "@/nodeDialog/composables/components/useHasNodeView";
import { injectionKey as flowVarMapKey } from "@/nodeDialog/composables/components/useProvidedFlowVariablesMap";
import { injectionKey as injectionKeyFromUseDirtySettings } from "@/nodeDialog/composables/nodeDialog/useDirtySettings";
import type { Control } from "@/nodeDialog/types/Control";
import { injectionKey as injectionKeyAddedArrayLayoutElements } from "../useAddedArrayLayoutItem";
import * as UseFlowVariablesModule from "../useFlowVariables";
import * as UseJsonFormsControlWithUpdateModule from "../useJsonFormsControlWithUpdate";

import UseDialogControlTestComponent from "./UseDialogControlTestComponent.vue";

describe("useDialogControl", () => {
  const props: any = "foo";

  let flowSettings: Ref<FlowSettings | null>,
    disabledByFlowVariables: Ref<boolean>,
    useFlowSettingsSpy: MockInstance,
    useJsonFormsControlWithUpdateSpy: MockInstance,
    control: Ref<Control>,
    handleChange: Mock,
    constructSettingState: Mock,
    settingState: {
      setValue: Mock;
    },
    getSettingState: Mock;

  const path = "path";
  const initialValue = "initial value";

  beforeEach(() => {
    flowSettings = ref(null);
    disabledByFlowVariables = ref(false);
    control = ref({
      path,
      enabled: true,
      visible: true,
      cells: null as any,
      config: null,
      data: initialValue,
      schema: {} as any,
      renderers: [],
      rootSchema: {} as any,
      id: "",
      description: "",
      label: "",
      errors: "",
      uischema: {
        type: "Control",
        scope: "#/properties/model/properties/mySetting",
      },
      required: true,
    });
    handleChange = vi.fn();
    useFlowSettingsSpy = vi
      .spyOn(UseFlowVariablesModule, "useFlowSettings")
      .mockImplementation(() => ({
        flowSettings,
        disabledByFlowVariables,
      }));
    useJsonFormsControlWithUpdateSpy = vi
      .spyOn(
        UseJsonFormsControlWithUpdateModule,
        "useJsonFormsControlWithUpdate",
      )
      .mockImplementation(() => ({ control, handleChange }));

    settingState = {
      setValue: vi.fn(),
    };
    constructSettingState = vi.fn(() => settingState);
    getSettingState = vi.fn(() => settingState);
  });

  const mountTestComponent = (
    { asChildOfAddedArrayLayoutElement } = {
      asChildOfAddedArrayLayoutElement: false,
    },
  ) => {
    return mount(UseDialogControlTestComponent, {
      props: { props },
      global: {
        provide: {
          [injectionKeyHasNodeView as symbol]: ref(true),
          [injectionKeyFromUseDirtySettings as symbol]: {
            constructSettingState,
            getSettingState,
          },
          [flowVarMapKey as symbol]: {
            myConfigKey: {
              controllingFlowVariableName: "first",
              exposedFlowVariableName: "second",
            },
          },
          ...(asChildOfAddedArrayLayoutElement
            ? { [injectionKeyAddedArrayLayoutElements as symbol]: true }
            : {}),
        },
      },
    });
  };

  it("works as expected", () => {
    const result = mountTestComponent().vm;
    expect(useJsonFormsControlWithUpdateSpy).toHaveBeenCalledWith(props);
    const flowSettingsParams = useFlowSettingsSpy.mock.calls[0][0];
    expect(flowSettingsParams.path.value).toStrictEqual(control.value.path);
    expect(result.control).toBe(control.value);
    expect(result.flowSettings).toBe(flowSettings.value);
  });

  const newValue = "newValue";

  it("calls handleChange on change", () => {
    const { onChange } = mountTestComponent().vm;
    onChange(newValue);
    expect(handleChange).toHaveBeenCalledWith(path, newValue);
  });

  describe("settings state", () => {
    it("calls getSettingState", () => {
      mountTestComponent();
      expect(getSettingState).toHaveBeenCalledWith(path);
      expect(settingState.setValue).toHaveBeenCalledWith(initialValue);
      expect(constructSettingState).not.toHaveBeenCalled();
    });

    it("calls constructSettingState if getSettingState yields null", () => {
      getSettingState.mockReturnValue(null);
      mountTestComponent();
      expect(getSettingState).toHaveBeenCalledWith(path);
      expect(constructSettingState).toHaveBeenCalledWith(
        path,
        expect.objectContaining({ initialValue }),
      );
    });

    it("initializes with undefined value and sets initial value afterwards on a child of an added array layout element", () => {
      getSettingState.mockReturnValue(null);
      mountTestComponent({ asChildOfAddedArrayLayoutElement: true });
      expect(getSettingState).toHaveBeenCalledWith(path);
      expect(constructSettingState).toHaveBeenCalledWith(
        path,
        expect.objectContaining({ initialValue: undefined }),
      );
      expect(settingState.setValue).toHaveBeenCalledWith(initialValue);
    });

    it("sets value on change", async () => {
      const { vm } = mountTestComponent();
      const changedValue = "changed";
      vm.control.data = changedValue;
      await flushPromises();
      expect(settingState.setValue).toHaveBeenCalledWith(changedValue);
    });

    it("sets undefined value on unmounted", () => {
      const wrapper = mountTestComponent();
      wrapper.unmount();
      expect(settingState.setValue).toHaveBeenCalledWith(undefined);
    });
  });

  describe("disabled", () => {
    it("is enabled if control is enabled and no controlling flow variable is set", () => {
      expect(mountTestComponent().vm.disabled).toBe(false);
    });

    it("is disabled if control is disabled", () => {
      control.value.enabled = false;
      expect(mountTestComponent().vm.disabled).toBe(true);
    });

    it("is disabled by flow variables", () => {
      disabledByFlowVariables.value = true;
      expect(mountTestComponent().vm.disabled).toBe(true);
    });
  });
});
