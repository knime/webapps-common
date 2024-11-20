import { type MaybeRef, type Ref, computed, nextTick, unref, watch } from "vue";

import { type Control } from "@/nodeDialog/types/Control";

export default (
  {
    control,
    disabled,
    controlElement,
  }: {
    control: MaybeRef<Control>;
    disabled: MaybeRef<boolean>;
    controlElement: Ref<{ focus?: () => void } | null>;
  },
  setters: {
    setDefault: () => void;
    setNull: () => void;
  },
) => {
  const hideOnNull = computed(
    () => unref(control).uischema?.options?.hideOnNull ?? false,
  );
  const isNull = computed(
    () =>
      unref(control).data === null ||
      typeof unref(control).data === "undefined",
  );
  const showControl = computed(() => !(hideOnNull.value && isNull.value));

  watch(
    () => showControl.value,
    () => nextTick(() => controlElement.value?.focus?.()),
  );

  const onUpdate = (checked: boolean) =>
    setters[checked ? "setDefault" : "setNull"]();

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
