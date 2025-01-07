import { type ExtractPropTypes, type Ref, computed } from "vue";
import { rendererProps } from "@jsonforms/vue";

import type { SettingComparator } from "@knime/ui-extension-service";

import type { FlowSettings } from "../../api/types";
import type { Control } from "../../types/Control";
import { isModelSettingAndHasNodeView } from "../../utils";

import type { Stringifyable } from "./JsonSettingsComparator";
import { useDirtySetting } from "./useDirtySetting";
import { useFlowSettings } from "./useFlowVariables";
import { injectHasNodeView } from "./useHasNodeView";
import { useJsonFormsControlWithUpdate } from "./useJsonFormsControlWithUpdate";

export const useTriggersReexecution = (control: Ref<Control>) => {
  const hasNodeView = injectHasNodeView();
  return computed(() =>
    Boolean(isModelSettingAndHasNodeView(control.value, hasNodeView.value)),
  );
};

export interface DialogControl<T = any> {
  onChange: (newValue: T) => void;
  handleChange: (path: string, value: any) => Promise<void>;
  flowSettings: Ref<null | FlowSettings>;
  control: Ref<Control>;
  disabled: Ref<boolean>;
}

export const useDialogControl = <ValueType extends Stringifyable = any>({
  props,
  valueComparator,
}: {
  props: Readonly<ExtractPropTypes<ReturnType<typeof rendererProps>>>;
  valueComparator?: SettingComparator<ValueType | undefined>;
}): DialogControl<ValueType> => {
  const { control, handleChange } = useJsonFormsControlWithUpdate(props);

  const settingState = useDirtySetting({
    dataPath: control.value.path,
    value: computed(() => control.value.data),
    valueComparator,
  });

  const { flowSettings, disabledByFlowVariables } = useFlowSettings({
    path: computed(() => control.value.path),
    settingState,
  });

  const onChange = (newValue: ValueType) => {
    handleChange(control.value.path, newValue);
  };

  const disabled = computed(() => {
    return !control.value.enabled || disabledByFlowVariables.value;
  });

  return {
    onChange,
    handleChange,
    flowSettings,
    control,
    disabled,
  };
};

export default useDialogControl;
