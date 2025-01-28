<script setup lang="ts">
import ErrorMessage from "./ErrorMessage.vue";

defineProps<{
  errors: Array<string>;
}>();
</script>

<template>
  <div class="error-message-wrapper">
    <slot />
    <ErrorMessage v-if="errors.length" :errors class="error-message" />
  </div>
</template>

<style lang="postcss" scoped>
.error-message-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-6);

  & .error-message {
    flex-shrink: 0;
  }
}
</style>
