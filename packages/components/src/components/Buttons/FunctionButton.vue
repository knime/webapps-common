<script>
import BaseButton from "../base/Button/BaseButton.vue";

/**
 * Works with an icon & text combination or a single icon.
 */
export default {
  name: "FunctionButton",
  components: {
    BaseButton,
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
      default: false,
    },
    /**
     * switches colors
     */
    primary: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    single() {
      if (this.$slots.default().length !== 1) {
        return false;
      }
      return this.hasSingleChildren(this.$slots.default()[0]);
    },
  },
  methods: {
    /**
     * This can be called from outside via focus on a $ref
     */
    focus() {
      this.$refs.baseButton.focus();
    },
    /**
     * This can be called from outside via getComponent on a $ref
     */
    getComponent() {
      return this.$refs.baseButton.getComponent();
    },
    hasSingleChildren(slotElement) {
      if (!slotElement.children) {
        return true;
      }
      if (slotElement.children.length === 1) {
        return this.hasSingleChildren(slotElement.children[0]);
      } else {
        return false;
      }
    },
  },
};
</script>

<template>
  <BaseButton
    ref="baseButton"
    :disabled="disabled"
    :class="['function-button', { single, active, primary, disabled, compact }]"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.function-button {
  --size-compact: 24px;
  --size-default: 30px;
  --size: var(--size-default);

  --icon-size-default: 18;
  --icon-size-compact: 16;
  --icon-size: var(--icon-size-default);

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
    width: var(--size);
    height: var(--size);
    align-items: center;
    justify-content: center;
    align-self: center;
  }

  & :deep(svg) {
    vertical-align: top;
    stroke: var(--theme-button-function-foreground-color);

    @mixin svg-icon-size var(--icon-size);
  }

  &.compact {
    padding: 3px;
    --size: var(--size-compact);

    & :deep(svg) {
      --icon-size: var(--icon-size-compact);
    }
  }

  & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
    fill: var(--theme-button-function-foreground-color);
  }

  &:hover {
    outline: none;
    color: var(--theme-button-function-foreground-color-hover);
    background-color: var(--theme-button-function-background-color-hover);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-hover);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-hover);
    }
  }

  &:focus {
    outline: none;
    color: var(--theme-button-function-foreground-color-focus);
    background-color: var(--theme-button-function-background-color-focus);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-focus);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-focus);
    }
  }

  &.active {
    color: var(--theme-button-function-foreground-color-active);
    background-color: var(--theme-button-function-background-color-active);

    & :deep(svg) {
      stroke: var(--theme-button-function-foreground-color-active);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-function-foreground-color-active);
    }
  }

  &.primary {
    color: var(--theme-button-foreground-color);
    background-color: var(--theme-button-background-color);

    & :deep(svg) {
      stroke: var(--theme-button-foreground-color);
    }

    & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
      fill: var(--theme-button-foreground-color);
    }

    &:hover {
      outline: none;
      color: var(--theme-button-foreground-color-hover);
      background-color: var(--theme-button-background-color-hover);

      & :deep(svg) {
        stroke: var(--theme-button-foreground-color-hover);
      }

      & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
        fill: var(--theme-button-foreground-color-hover);
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

      & :deep(svg) path[fill]:not([fill=""], [fill="none"]) {
        fill: var(--theme-button-foreground-color-focus);
      }
    }
  }

  &.disabled {
    /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
