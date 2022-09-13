<script>
import BaseButton from './BaseButton.vue';

/**
 * Works with an icon & text combination or a single icon.
 */
export default {
    components: {
        BaseButton
    },
    props: {
        /**
         * @see {@link BaseButton.vue}
         */

        /**
         * Switches the active style of the component
         */
        active: {
            type: Boolean,
            default: false
        },
        /**
         * switches colors
         */
        primary: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        single() {
            return this.$slots.default().length === 1;
        }
    },
    methods: {
        focus() {
            // This can be called from outside via focus on a $ref */
            this.$el.focus();
        }
    }
};
</script>

<template>
  <BaseButton
    v-bind="$attrs"
    :class="['function-button', { single, active, primary, disabled }]"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
.function-button {
  display: flex;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  font-family: var(--theme-text-medium-font-family);
  line-height: 18px;
  padding: 6px 15px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--theme-button-function-foreground-color);
  background-color: var(--theme-button-function-background-color, transparent);

  /* best way to ensure pill shaped buttons with flexible 1/4 corners */
  border-radius: var(--theme-button-function-border-radius, 9999px);

  /*
  Add margin to first children, using last-child and first-child to avoid problems in build
  */
  & :deep(> *) {
    &:first-child {
      margin-right: 8px;
    }

    &:last-child {
      margin-right: 0;
    }
  }


  &.single {
    padding: 6px;
  }

  & :deep(svg) {
    vertical-align: top;
    stroke: var(--theme-button-function-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }

  &:hover {
    outline: none;
    color: var(--theme-button-function-foreground-color-hover);
    background-color: var(--theme-button-function-background-color-hover);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-hover);
    }
  }

  &:focus {
    outline: none;
    color: var(--theme-button-function-foreground-color-focus);
    background-color: var(--theme-button-function-background-color-focus);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-focus);
    }
  }

  &.active {
    color: var(--theme-button-function-foreground-color-active);
    background-color: var(--theme-button-function-background-color-active);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-active);
    }
  }

  &.primary {
    color: var(--theme-button-foreground-color);
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }

    &:hover {
      outline: none;
      color: var(--theme-button-foreground-color-hover);
      background-color: var(--theme-button-background-color-hover);

      & :deep(svg) {
        stroke: var(--theme-button-foreground-color-hover);
      }
    }

    &:active,
    &:focus {
      outline: none;
      color: var(--theme-button-foreground-color-focus);
      background-color: var(--theme-button-background-color-focus);

      & :deep(svg) {
        stroke: var(--theme-button-foreground-color-focus);
      }
    }
  }

  &.disabled { /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
