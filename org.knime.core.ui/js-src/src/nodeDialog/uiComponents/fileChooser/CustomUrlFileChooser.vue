<script setup lang="ts">
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import NumberInput from "webapps-common/ui/components/forms/NumberInput.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";

defineProps<{
  disabled: boolean;
  modelValue: { path: string; timeout: number };
  id: string | null;
}>();
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
