<script>
export default {
    props: {
        /**
         * if set, the button renders an <a> element instead of a <button> element
         */
        href: {
            type: String,
            default: ''
        },
        // to pass-trough all other props
        optionalProps: {
            type: Object,
            default: () => ({})
        },
        /**
         * show button with border
         */
        withBorder: {
            type: Boolean,
            default: false
        },
        /**
         * switches hover colors to use button on a dark background
         */
        onDark: {
            type: Boolean,
            default: false
        },
        /**
         * smaller font size and padding
         */
        compact: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onClick() {
            this.$emit('click');
        }
    }
};
</script>

<template>
  <Component
    :is="href ? 'a' : 'button'"
    :href="href ? href : false"
    :class="[
      'button-primary',
      {'with-border': withBorder},
      {'on-dark': onDark},
      {'compact': compact}
    ]"
    v-bind="optionalProps"
    @click="onClick"
  >
    <slot />
  </Component>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.button-primary {
  background-color: var(--theme-color-1);
  display: block;
  text-align: center;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  padding: 12px;
  text-decoration: none;
  margin-bottom: 10px;
  border: 0;
  cursor: pointer;

  &:active,
  &:hover {
    outline: none;
    background-color: var(--theme-color-4);
    color: var(--theme-color-3);
  }

  &.with-border {
    border: 1px solid var(--theme-color-2);
  }

  &.on-dark {
    color: var(--theme-color-2);

    &:active,
    &:hover {
      background-color: var(--theme-color-3);
    }
  }

  &.compact {
    padding: 6px 15px;
    min-width: 50px;
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
