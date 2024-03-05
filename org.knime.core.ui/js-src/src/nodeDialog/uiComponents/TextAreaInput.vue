<script setup lang="ts">
import useDialogControl from "../composables/components/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";
import TextArea from "webapps-common/ui/components/forms/TextArea.vue";
import { rendererProps } from "@jsonforms/vue";
const props = defineProps(rendererProps());
const { control, onChange, disabled } = useDialogControl<string>({ props });
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <TextArea
      :id="labelForId"
      class="text-area-input"
      :model-value="control.data"
      :disabled="disabled"
      :rows="control.uischema.options?.rows"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>

<style lang="postcss" scoped>
.text-area-input {
  max-width: 100%;

  & :deep(textarea) {
    resize: vertical;
    width: 100%;
    min-height: 40px;
    padding: 10px;
  }
}
</style>
