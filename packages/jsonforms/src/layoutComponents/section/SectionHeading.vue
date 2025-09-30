<script setup lang="ts">
defineProps<{
  titleText: string;
}>();
</script>

<template>
  <div class="section-header">
    <div class="section-header-layout-container">
      <h3>
        {{ titleText }}
      </h3>
      <slot name="right-buttons" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.section-header {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0 calc(-1 * var(--horizontal-dialog-padding));
  background-color: var(--knime-gray-ultra-light);

  & .section-header-layout-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* stylelint-disable-next-line csstools/value-no-unknown-custom-properties */
    width: calc(100% - var(--horizontal-dialog-padding) * 2);
    /* stylelint-disable-next-line csstools/value-no-unknown-custom-properties */
    margin: 0 var(--horizontal-dialog-padding);
    border-bottom: 1px solid var(--knime-silver-sand);

    & h3 {
      margin: 0;
      font-size: 16px;
      line-height: 40px;
      color: var(--knime-masala);
    }
  }
}
</style>
