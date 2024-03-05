<script setup lang="ts">
import NumberInput from "webapps-common/ui/components/forms/NumberInput.vue";
import { rendererProps } from "@jsonforms/vue";
import useDialogControl from "../composables/components/useDialogControl";
import { type PropType, computed } from "vue";
import LabeledInput from "./label/LabeledInput.vue";

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
  <LabeledInput
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
      @update:model-value="onChange"
      @focusout="onFocusOut"
    />
  </LabeledInput>
</template>
