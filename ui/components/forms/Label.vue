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
    <span class="label-text">{{ text }}</span>
    <slot />
  </label>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

.label-text {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  display: block;
  margin-bottom: 5px;
}
</style>
