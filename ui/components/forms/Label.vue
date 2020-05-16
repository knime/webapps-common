<script>
/**
 * Default label component
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
    <span class="label-text">
      {{ text }}
    </span>
    <slot />
  </label>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

.label-text {
  font-weight: 700;
  font-size: 16px;
  font-family: var(--theme-text-medium-font-family);
  color: var(--theme-text-medium-color);
  line-height: 20px;
  display: inline-block;
  margin-bottom: 10px;
}
</style>
