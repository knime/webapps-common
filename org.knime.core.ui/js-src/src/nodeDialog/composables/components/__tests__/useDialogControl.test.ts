import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  MockInstance,
} from "vitest";
import * as UseJsonFromsControlWithUpdateModule from "../useJsonFormsControlWithUpdate";
import * as UseFlowVariablesModule from "../useFlowVariables";
import { type Ref, ref } from "vue";
import { FlowSettings } from "@/nodeDialog/api/types/index";
import Control from "@/nodeDialog/types/Control";
import UseDialogControlTestComponent from "./UseDialogControlTestComponent.vue";
import { mount } from "@vue/test-utils";
import { injectionKey as injectionKeyFromUseDirtySettings } from "@/nodeDialog/composables/nodeDialog/useDirtySettings";
import { injectionKey as injectionKeyAddedArrayLayoutElements } from "../useAddedArrayLayoutItem";
import flushPromises from "flush-promises";

describe("useDialogControl", () => {
  const props: any = "foo";

  let flowSettings: Ref<FlowSettings | null>,
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
  const configKeys = ["configKey1", "configKey2"];
  const configPaths = configKeys.map((key) => `${path}.${key}`);
  const initialValue = "initial value";

  beforeEach(() => {
    flowSettings = ref(null);
    control = ref({
      path,
      enabled: true,
      visible: true,
      cells: null as any,
      config: null,
      data: initialValue,
      schema: {
        configKeys,
      } as any,
      renderers: [],
      rootSchema: {
        hasNodeView: true,
      } as any,
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
        configPaths: ref(
          configPaths.map((configPath) => ({
            configPath,
            deprecatedConfigPaths: [],
          })),
        ),
      }));
    useJsonFormsControlWithUpdateSpy = vi
      .spyOn(
        UseJsonFromsControlWithUpdateModule,
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
          [injectionKeyFromUseDirtySettings as symbol]: {
            constructSettingState,
            getSettingState,
          },
          getFlowVariablesMap: () => ({
            [configPaths[0]]: {
              controllingFlowVariableName: "first",
              exposedFlowVariableName: "second",
            },
          }),
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
    expect(flowSettingsParams.control).toStrictEqual(control);
    expect(flowSettingsParams.subConfigKeys).toBeUndefined();
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

    it("is disabled if a controlling flow variable is set", () => {
      flowSettings.value = {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "myVar",
        exposedFlowVariableName: null,
      };
      expect(mountTestComponent().vm.disabled).toBe(true);
    });
  });
});
