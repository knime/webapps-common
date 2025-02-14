<script setup lang="ts">
import ErrorMessage from "./ErrorMessage.vue";

defineProps<{
  errors: Array<string>;
}>();
</script>

<template>
  <div :class="['error-message-wrapper', { 'with-error': errors.length > 0 }]">
    <slot />
    <ErrorMessage
      v-for="(error, index) in errors"
      :key="index"
      :error
      class="error-message"
    />
  </div>
</template>

<style lang="postcss" scoped>
.error-message-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--space-base);

  &.with-error {
    /**
     * We want to not take any additional space if the error message has its minimal height of 
     * 3 * var(--space-base)
     */
    margin-bottom: calc(-4 * var(--space-base));
  }

  & .error-message {
    flex-shrink: 0;
  }
}
</style>
