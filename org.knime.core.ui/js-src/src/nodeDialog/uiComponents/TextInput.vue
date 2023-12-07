<script setup lang="ts">
import { computed } from "vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import LabeledInput from "./label/LabeledInput.vue";
import useDialogControl from "../composables/useDialogControl";
import { rendererProps } from "@jsonforms/vue";

const props = defineProps(rendererProps());
const {
  handleDirtyChange: onChange,
  control,
  disabled,
} = useDialogControl<string>({ props });
const placeholder = computed(
  () => control.value.uischema.options?.placeholder ?? "",
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <InputField
      :id="labelForId"
      :placeholder="placeholder"
      :model-value="control.data"
      :disabled="disabled"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
