<script>
/**
 * Default label for widgets.
 */
export default {
    props: {
        text: {
            default: '',
            type: String
        }
    }
};
</script>

<template>
  <label>
    <!-- knime-qf-title legacy selector -->
    <span class="knime-qf-title">{{ text }}</span>
    <slot></slot>
  </label>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

.knime-qf-title {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: block;
  margin-bottom: 5px;
}
</style>
