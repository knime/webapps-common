<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";

import { TextArea } from "@knime/components";

import useDialogControl from "../composables/components/useDialogControl";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());
const { control, onChange, disabled } = useDialogControl<string>({ props });
</script>

<template>
  <LabeledControl
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
  </LabeledControl>
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
