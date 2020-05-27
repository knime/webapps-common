<script>
import BaseButton from './BaseButton';

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
        }
    },
    computed: {
        single() {
            return this.$slots.default.length === 1;
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
    :class="['function-button', {single}, {active}]"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </BaseButton>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.function-button {
  display: flex;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  padding: 6px 15px;
  text-decoration: none;
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;
  border-radius: 9999px; /* best way to ensure pill shaped buttons with flexible 1/4 corners */

  /*
  Add margin to first children, using last-child and first-child to avoid problems in build
  */
  & >>> > * {
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

  & >>> svg {
    vertical-align: top;
    stroke: var(--theme-color-dove-gray);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }

  &:focus,
  &:hover {
    outline: none;
    color: var(--theme-color-masala);
    background-color: var(--theme-color-silver-sand-semi);

    & >>> svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.active {
    color: var(--theme-color-white);
    background-color: var(--theme-color-masala);

    & >>> svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>
