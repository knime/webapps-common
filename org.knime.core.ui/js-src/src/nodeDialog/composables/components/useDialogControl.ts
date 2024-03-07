import { rendererProps } from "@jsonforms/vue";
import { useJsonFormsControlWithUpdate } from "./useJsonFormsControlWithUpdate";
import {
  type Ref,
  type MaybeRef,
  computed,
  ExtractPropTypes,
  unref,
} from "vue";
import { isModelSettingAndHasNodeView } from "@/nodeDialog/utils";
import { useFlowSettings } from "./useFlowVariables";
import Control from "@/nodeDialog/types/Control";
import { SettingComparator } from "@knime/ui-extension-service";
import { Stringifyable } from "./JsonSettingsComparator";
import { useDirtySetting } from "./useDirtySetting";

export const useTriggersReexecution = (control: Ref<Control>) => {
  return computed(() => Boolean(isModelSettingAndHasNodeView(control.value)));
};

export const useDialogControl = <ValueType extends Stringifyable = any>({
  props,
  subConfigKeys,
  valueComparator,
}: {
  props: Readonly<ExtractPropTypes<ReturnType<typeof rendererProps>>>;
  subConfigKeys?: MaybeRef<string[] | undefined>;
  valueComparator?: SettingComparator<ValueType | undefined>;
}) => {
  const { control, handleChange } = useJsonFormsControlWithUpdate(props);

  const settingState = useDirtySetting({
    dataPath: control.value.path,
    value: computed(() => control.value.data),
    valueComparator,
  });

  const { flowSettings } = useFlowSettings({
    control,
    subConfigKeys: unref(subConfigKeys),
    settingState,
  });

  const onChange = (newValue: ValueType) => {
    handleChange(control.value.path, newValue);
  };

  const disabled = computed(() => {
    return (
      !control.value.enabled ||
      Boolean(flowSettings.value?.controllingFlowVariableName)
    );
  });

  return {
    onChange,
    flowSettings,
    control,
    disabled,
  };
};

export default useDialogControl;
