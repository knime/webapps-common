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

  /* required for text ellipsis on checkboxes and radiobuttons  */
  min-width: 100% !important; /* fix for Edge Legacy (v12-18); otherwise auto would be sufficient */

  & > legend {
    font-weight: 700;
    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    font-size: 16px;
    line-height: 20px;
    cursor: default;
    margin-bottom: 10px;

    & svg {
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

  /* labels inside of the fieldset look different (smaller) same applies to second level fieldset legends (e.g. for
    Radiobuttons inside of ValueFilterSelectionWidget) */
  & >>> .label-text,
  & > fieldset > legend {
    font-weight: 500;
    font-family: var(--theme-text-medium-font-family);
    color: var(--theme-text-medium-color);
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 3px;
  }

  & >>> .label-wrapper,
  & > fieldset {
    margin-top: 10px;
  }

  /* avoid duplicated margins */
  & >>> legend + .label-wrapper {
    margin-top: 0;
  }
}
</style>
