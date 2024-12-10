<script setup lang="ts">
import { type PropType, computed } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { NumberInput } from "@knime/components";

import useDialogControl from "../composables/components/useDialogControl";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps({
  ...rendererProps(),
  type: {
    type: String as PropType<"integer" | "double">,
    required: false,
    default: "double",
  },
});
const { control, onChange, disabled } = useDialogControl<number>({ props });

const min = computed(() => control.value.schema.minimum);
const max = computed(() => control.value.schema.maximum);

const onFocusOut = () => {
  const num = control.value.data;
  if (typeof min.value === "number" && num < min.value) {
    onChange(min.value);
  } else if (typeof max.value === "number" && num > max.value) {
    onChange(max.value);
  }
};
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <NumberInput
      :id="labelForId ?? undefined"
      class="number-input"
      :disabled="disabled"
      :model-value="control.data"
      :type="type"
      :min="control.schema.minimum"
      :max="control.schema.maximum"
      compact
      @update:model-value="onChange"
      @focusout="onFocusOut"
    />
  </LabeledControl>
</template>
