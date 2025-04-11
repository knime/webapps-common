<script setup lang="ts">
import ErrorLine from "./ErrorLine.vue";

withDefaults(
  defineProps<{
    errors: Array<string>;
    fill?: boolean;
  }>(),
  {
    fill: false,
  },
);
</script>

<template>
  <div
    :class="[
      'error-message-wrapper',
      { 'with-error': errors.length > 0, fill },
    ]"
  >
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
  gap: var(--error-message-vertical-padding);

  &.fill {
    flex: 1;
  }

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
