<script>
/**
 * Fieldset for elements that contain more than one input field
 */
export default {
  provide: {
    bigLabels: true,
  },
  props: {
    text: {
      default: "",
      type: String,
    },
  },
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
fieldset {
  /* reset default styles */
  margin: 0;
  padding: 0;
  outline: none;
  border: none;

  & > legend {
    font-weight: 700;
    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    line-height: 20px;
    cursor: default;
    margin-bottom: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;

    & :slotted(svg) {
      margin-right: 0;
      height: 14px;
      width: 14px;
      stroke-width: calc(32px / 14);
      stroke: var(--knime-masala);
      cursor: pointer;
      display: block;
      float: right;
      margin-top: 3px;
      margin-left: 4px;
    }
  }

  /* Second level fieldset legends look smaller (e.g. for Radiobuttons inside of ValueFilterSelectionWidget) */
  & > fieldset > legend {
    font-weight: 500;
    font-family: var(--theme-text-medium-font-family);
    color: var(--theme-text-medium-color);
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 3px;
  }

  & :deep(.label-wrapper),
  & > fieldset {
    margin-top: 10px;
  }

  /* avoid duplicated margins */
  & :deep(legend + .label-wrapper) {
    margin-top: 0;
  }
}
</style>
