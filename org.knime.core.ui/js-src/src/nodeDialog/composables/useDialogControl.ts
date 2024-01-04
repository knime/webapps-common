import { rendererProps } from "@jsonforms/vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import {
  type Ref,
  type MaybeRef,
  computed,
  ExtractPropTypes,
  unref,
} from "vue";
import { isModelSettingAndHasNodeView } from "../utils";
import { useFlowSettings } from "./useFlowVariables";
import Control from "../types/Control";
// @ts-ignore
import { useStore } from "vuex";

export const useTriggersReexecution = (control: Ref<Control>) => {
  return computed(() => Boolean(isModelSettingAndHasNodeView(control.value)));
};

const getHandleDirtyChangeMethods = <ValueType>(
  control: Ref<Control>,
  handleChange: (path: string, value: ValueType) => void,
) => {
  const store = useStore();
  const triggersReexecution = useTriggersReexecution(control);
  const triggerReexecution = () => {
    if (triggersReexecution.value) {
      // @ts-ignore
      store.dispatch("pagebuilder/dialog/dirtySettings", true);
    }
  };
  const handleDirtyChange = (newValue: ValueType) => {
    handleChange(control.value.path, newValue);
    triggerReexecution();
  };
  return { handleDirtyChange, triggerReexecution };
};

export default <ValueType>({
  props,
  subConfigKeys,
}: {
  props: Readonly<ExtractPropTypes<ReturnType<typeof rendererProps>>>;
  subConfigKeys?: MaybeRef<string[] | undefined>;
}) => {
  const { control, handleChange: handleChangeUntyped } =
    useJsonFormsControlWithUpdate(props);
  const handleChange = handleChangeUntyped as (
    path: string,
    value: ValueType,
  ) => void;

  const { handleDirtyChange, triggerReexecution } =
    getHandleDirtyChangeMethods<ValueType>(control, handleChange);

  const flowSettings = useFlowSettings({
    control,
    subConfigKeys: unref(subConfigKeys),
  });

  const disabled = computed(() => {
    return (
      !control.value.enabled ||
      Boolean(flowSettings.value?.controllingFlowVariableName)
    );
  });

  return {
    handleChange,
    handleDirtyChange,
    triggerReexecution,
    flowSettings,
    control,
    disabled,
  };
};
