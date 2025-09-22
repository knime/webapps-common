<script>
/**
 * Fieldset for elements that contain more than one input field
 */
export default {
  name: "Fieldset",
  provide: {
    largeLabels: false,
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
  min-inline-size: unset;
  padding: 0;

  /* reset default styles */
  margin: 0;
  outline: none;
  border: none;

  & > legend {
    display: block;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--theme-text-bold-font-family);
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    color: var(--theme-text-bold-color);
    cursor: default;

    & :slotted(svg) {
      float: right;
      display: block;
      width: 14px;
      height: 14px;
      margin-top: 3px;
      margin-right: 0;
      margin-left: 4px;
      cursor: pointer;
      stroke: var(--knime-masala);
      stroke-width: calc(32px / 14);
    }
  }

  /* Second level fieldset legends look smaller (e.g. for Radiobuttons inside of ValueFilterSelectionWidget) */
  & > fieldset > legend {
    margin-bottom: 3px;
    font-family: var(--theme-text-medium-font-family);
    font-size: 13px;
    font-weight: 500;
    line-height: 18px;
    color: var(--theme-text-medium-color);
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
