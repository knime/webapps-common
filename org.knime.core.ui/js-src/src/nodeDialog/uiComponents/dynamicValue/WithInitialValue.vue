<script setup lang="ts">
import { watch } from "vue";

const props = defineProps<{
  initialValue: unknown;
  value: unknown;
}>();

const emit = defineEmits<{
  updateValue: [unknown];
}>();

watch(
  () => props.value,
  (newValue) => {
    newValue === null && emit("updateValue", props.initialValue);
  },
  { immediate: true },
);
</script>

<template>
  <slot />
</template>
