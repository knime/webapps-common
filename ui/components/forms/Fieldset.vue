<script>
/**
 * Fieldset for elements that contain more than one input field
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
  <fieldset>
    <legend>
      {{ text }}
      <slot name="icon" />
    </legend>
    <slot />
  </fieldset>
</template>

<style lang="postcss" scoped>
@import "../../css/variables";

fieldset {
  /* reset default styles */
  margin: 0;
  padding: 0;
  outline: none;
  border: none;

  & > legend {
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    cursor: default;

    & svg {
      margin-right: 0;
      height: 14px;
      width: 14px;
      stroke-width: calc(32px / 14);
      stroke: var(--theme-color-masala);
      cursor: pointer;
      display: block;
      float: right;
      margin-top: 3px;
      margin-left: 4px;
    }
  }

  /* labels inside of the fieldset look different (smaller) */
  & >>> .label-text {
    font-weight: 500;
    font-size: 13px;
    line-height: 18px;
    margin-top: 10px;
    margin-bottom: 3px;
  }
}
</style>
