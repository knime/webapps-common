<script setup lang="ts">
import { InputField, Label, NumberInput } from "@knime/components";

import ErrorMessage from "@/nodeDialog/uiComponents/ErrorMessage.vue";

withDefaults(
  defineProps<{
    disabled?: boolean;
    modelValue: { path: string; timeout: number };
    id: string | null;
    urlErrorMessage?: string | null;
  }>(),
  {
    disabled: false,
    urlErrorMessage: null,
  },
);
defineEmits(["update:path", "update:timeout"]);
</script>

<template>
  <InputField
    :id="id"
    :disabled="disabled"
    :model-value="modelValue.path"
    placeholder="URL"
    @update:model-value="$emit('update:path', $event)"
  />
  <ErrorMessage
    v-if="urlErrorMessage"
    :style="{ display: 'unset' }"
    :errors="[{ message: urlErrorMessage }]"
  />
  <Label #default="{ labelForId }" class="timeout" text="Timeout">
    <NumberInput
      :id="labelForId"
      type="integer"
      :min="0"
      :disabled="disabled"
      :model-value="modelValue.timeout"
      @update:model-value="$emit('update:timeout', $event)"
    />
  </Label>
</template>

<style scoped lang="postcss">
.timeout.timeout {
  margin-top: 10px;
}
</style>
