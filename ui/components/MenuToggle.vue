<script>
/**
 * Works with an icon & text combination or a single icon.
 */
export default {
    props: {
        /**
         * Switches state of function button
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
            this.$el.focus();
        }
    }
};
</script>

<template>
  <button
    ref="toggle"
    :class="['toggle', {single}, {active}]"
    v-on="$listeners"
  >
    <slot />
  </button>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.toggle {
  display: inline-block;
  text-align: center;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  padding: 6px 15px;
  text-decoration: none;
  height: 100%;
  border: 0;
  cursor: pointer;
  color: var(--theme-color-dove-gray);
  background-color: transparent;
  border-radius: 9999px; /* best way to ensure pill shaped buttons with flexible 1/4 corners */

  &.single {
    padding: 6px;
  }

  /* Space button children items evenly except the first one */
  & > * {
    margin-left: 8px;

    &:first-child {
      margin-left: 0;
    }
  }

  & svg {
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

    & svg {
      stroke: var(--theme-color-masala);
    }
  }

  &.active {
    color: var(--theme-color-white);
    background-color: var(--theme-color-masala);

    & svg {
      stroke: var(--theme-color-white);
    }
  }
}
</style>
