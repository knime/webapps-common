<script>
/**
 * Base Message banner component
 */
export default {
  name: "BaseMessage",
  props: {
    /**
     * One of 'info', 'error', 'success', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling
     */
    type: {
      type: String,
      default: "info",
      validator(type = "info") {
        return ["info", "error", "success", "warn"].includes(type);
      },
    },
  },
};
</script>

<template>
  <section :class="type">
    <div class="grid-container">
      <div class="grid-item-12">
        <slot />
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
section {
  overflow: hidden;
  border-bottom: 1px solid var(--knime-white);

  & .grid-item-12 {
    position: relative;
    display: flex;
    align-items: center;
    padding: 15px 0;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    color: var(--knime-white);
  }

  &.info {
    background-color: var(--theme-color-info);
  }

  &.error {
    background-color: var(--theme-color-error);
  }

  &.success {
    background-color: var(--theme-color-success);
  }

  &.warn {
    background-color: var(--theme-color-action-required);
  }
}
</style>
