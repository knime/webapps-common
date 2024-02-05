import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type SpyInstance,
  type Mock,
} from "vitest";
import * as UseJsonFromsControlWithUpdateModule from "../useJsonFormsControlWithUpdate";
import * as UseFlowVariablesModule from "../useFlowVariables";
import { type Ref, ref } from "vue";
import { FlowSettings } from "@/nodeDialog/api/types/index";
import Control from "@/nodeDialog/types/Control";
import UseDialogControlTestComponent from "./UseDialogControlTestComponent.vue";
import { mount } from "@vue/test-utils";

describe("useDialogControl", () => {
  const props: any = "foo";

  let flowSettings: Ref<FlowSettings | null>,
    useFlowSettingsSpy: SpyInstance<any>,
    useJsonFormsControlWithUpdateSpy: SpyInstance<any>,
    control: Ref<Control>,
    handleChange: Mock,
    setDirtyModelSettingsMock: Mock;
  const path = "path";
  const configKeys = ["configKey1", "configKey2"];

  beforeEach(() => {
    flowSettings = ref(null);
    control = ref({
      path,
      enabled: true,
      visible: true,
      cells: null as any,
      config: null,
      data: null,
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
    setDirtyModelSettingsMock = vi.fn();
    useFlowSettingsSpy = vi
      .spyOn(UseFlowVariablesModule, "useFlowSettings")
      .mockImplementation(() => flowSettings);
    useJsonFormsControlWithUpdateSpy = vi
      .spyOn(
        UseJsonFromsControlWithUpdateModule,
        "useJsonFormsControlWithUpdate",
      )
      .mockImplementation(() => ({ control, handleChange }));
  });

  const mountTestComponent = () => {
    return mount(UseDialogControlTestComponent, {
      props: { props },
      global: {
        provide: {
          setDirtyModelSettings: setDirtyModelSettingsMock,
        },
      },
    }).vm;
  };

  it("works as expected", () => {
    const result = mountTestComponent();
    expect(useJsonFormsControlWithUpdateSpy).toHaveBeenCalledWith(props);
    const flowSettingsParams = useFlowSettingsSpy.mock.calls[0][0];
    expect(flowSettingsParams.control).toStrictEqual(control);
    expect(flowSettingsParams.subConfigKeys).toBeUndefined();
    expect(result.control).toBe(control.value);
    expect(result.flowSettings).toBe(flowSettings.value);
    expect(result.handleChange).toBe(handleChange);
  });

  describe("dirty settings state", () => {
    const newValue = "newValue";
    const mountAndChange = () => {
      const { handleDirtyChange } = mountTestComponent();
      handleDirtyChange(newValue);
    };

    it("calls handleChange on change", () => {
      mountAndChange();
      expect(handleChange).toHaveBeenCalledWith(path, newValue);
    });

    it("sets settings dirty on change of a model setting with node view", () => {
      mountAndChange();
      expect(setDirtyModelSettingsMock).toHaveBeenCalled();
    });

    it("sets settings dirty on triggerReexecution call", () => {
      mountTestComponent().triggerReexecution();
      expect(setDirtyModelSettingsMock).toHaveBeenCalled();
    });

    it("does not set settings dirty on change of a non-model setting", () => {
      control.value.uischema.scope = "#/properties/view/properties/mySetting";
      mountAndChange();
      expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
    });

    it("does not set settings dirty on change of a model setting without a node view", () => {
      control.value.rootSchema.hasNodeView = false;
      mountAndChange();
      expect(setDirtyModelSettingsMock).not.toHaveBeenCalled();
    });
  });

  describe("disabled", () => {
    it("is enabled if control is enabled and no controlling flow variable is set", () => {
      expect(mountTestComponent().disabled).toBe(false);
    });

    it("is disabled if control is disabled", () => {
      control.value.enabled = false;
      expect(mountTestComponent().disabled).toBe(true);
    });

    it("is disabled if a controlling flow variable is set", () => {
      flowSettings.value = {
        controllingFlowVariableAvailable: true,
        controllingFlowVariableName: "myVar",
        exposedFlowVariableName: null,
      };
      expect(mountTestComponent().disabled).toBe(true);
    });
  });
});
