<script setup lang="ts">
import { Label } from "@knime/components";

defineProps<{
  title: string;
  scale: boolean;
}>();
</script>

<template>
  <Label
    v-if="title"
    #default="{ labelForId }"
    :class="['label', { scale }]"
    :text="title"
    large
  >
    <slot :label-for-id="labelForId" />
  </Label>
  <slot v-else :label-for-id="undefined" />
</template>

<style scoped lang="postcss">
@media print {
  .label {
    break-inside: avoid;
  }
}

.scale {
  max-height: 100%;
  display: flex;
  flex-direction: column;

  & :deep(label) {
    flex-shrink: 0;
  }
}
</style>
