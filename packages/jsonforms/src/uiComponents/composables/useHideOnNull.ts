import { type Ref, computed, nextTick, unref, watch } from "vue";

import { type Control } from "../../types/Control";

import useProvidedState from "./useProvidedState";

export default ({
  control,
  disabled,
  changeValue,
  controlElement,
}: {
  control: Ref<Control>;
  disabled: Ref<boolean>;
  changeValue: (value: unknown) => void;
  controlElement: Ref<{ focus?: () => void } | null>;
}) => {
  const hideOnNull = computed(
    () => unref(control).uischema?.options?.hideOnNull ?? false,
  );
  const defaultProvider = computed(
    () => control.value.uischema.options?.defaultProvider,
  );
  const defaultValue = useProvidedState(
    defaultProvider,
    control.value.uischema.options?.default,
  );

  const isNull = computed(
    () =>
      unref(control).data === null ||
      typeof unref(control).data === "undefined",
  );
  const showControl = computed(() => !(hideOnNull.value && isNull.value));

  /**
   * In case the checkbox is checked and the control exposes a focus method, we focus it.
   */
  watch(
    () => showControl.value,
    (show) => {
      if (show) {
        nextTick(() => controlElement.value?.focus?.());
      }
    },
  );

  const onUpdate = (checked: boolean) =>
    changeValue(checked ? defaultValue.value : null);

  return {
    showCheckbox: hideOnNull,
    showControl,
    checkboxProps: computed(() => ({
      modelValue: !isNull.value,
      "onUpdate:modelValue": onUpdate,
      disabled: unref(disabled),
      /**
       * These styles grant that the checkbox aligns with the label when placed in a LabeledControl
       */
      style: {
        marginTop: "-3px",
        marginRight: "-15px",
      },
    })),
  };
};
