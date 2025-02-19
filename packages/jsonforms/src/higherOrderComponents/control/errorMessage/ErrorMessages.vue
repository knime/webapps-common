<script setup lang="ts">
import ErrorLine from "./ErrorLine.vue";

defineProps<{
  errors: Array<string>;
}>();
</script>

<template>
  <div :class="['error-message-wrapper', { 'with-error': errors.length > 0 }]">
    <slot />
    <ErrorLine
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
  gap: var(--error-message-vertical-padding);

  &.with-error {
    /**
     * We want to not take any additional space if the error consists of one line.
     */
    margin-bottom: calc(
      -1 * (var(--error-message-single-line-height) +
            var(--error-message-vertical-padding))
    );
  }

  & .error-message {
    flex-shrink: 0;
  }
}
</style>
