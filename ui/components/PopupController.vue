<script>
const BLUR_TIMEOUT = 200; // ms

export default {
    props: {
        /**
         * Identifier for clickhandler
         */
        id: {
            default: '',
            type: String
        },
        /**
         * Alignment of the submenu with the menu button
         * left or right. Defaults to 'right'.
         */
        orientation: {
            type: String,
            default: 'right',
            validator(orientation = 'right') {
                return ['right', 'left', 'top'].includes(orientation);
            }
        },
        /**
         * Disable SubMenu
         */
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        onItemClick(event, item) {
            this.$emit('item-click', event, item, this.id);
        },
        /**
         * Edge loses focus faster then emitting the actual click event, therefore we need to keep the focus on the
         * submenu when the focus is about to change and only loose it when a click occurs outside of the submenu-items.
         * To guarantee that this approach is working, the class name 'clickable-item' should only be used
         * on submenu-items
         *
         * @param {Object} e - event object
         * @returns {Boolean}
         */
        onMenuClick(e) {
            if (e.relatedTarget && e.relatedTarget.className.includes('clickable-item')) {
                let el = e.currentTarget || e.relatedTarget; // Edge needs currentTarget
                el.focus();
                setTimeout(() => {
                    el.blur(); // manually blur to close submenu consistently across browsers
                }, BLUR_TIMEOUT);
            }
            return true;
        }
    }
};
</script>


<template>
  <div :class="[{ disabled }, 'popup']">
    <!-- The @click is required by Firefox -->
    <div
      class="popup-toggle-container"
      aria-haspopup="true"
      tabindex="0"
      @click="e => { e.currentTarget.focus(); }"
      @blur="onMenuClick"
    >
      <slot name="toggle" />
    </div>
    <div
      :class="`orient-${orientation} popup-content`"
      aria-label="submenu"
      role="menu"
    >
      <slot name="popup" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.popup-toggle-container {
  height: 100%;

  &:active,
  &:hover,
  &:focus {
    outline: none;
  }
}

.popup-toggle >>> button {
  display: block;
  color: inherit;
  font-weight: inherit;
  background: transparent;
  padding: 0;
  border: 0 none;
  text-decoration: none;
  cursor: pointer;

  /* &:active,
  &:hover,
  &:focus {
    outline: none;
  } */
}

.popup-content {
  display: none;
  position: absolute;
  right: 0;
  margin-top: 8px;
  box-shadow: 0 1px 4px 0 var(--theme-color-gray-dark-semi);
  z-index: 2;

  &.orient-left {
    right: auto;
    left: 0;
  }

  &.orient-top {
    bottom: 18px;
    right: 10px;
  }
}

.popup {
  position: relative;

  &.disabled { /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }

  &:focus-within .popup-content,
  & .popup-toggle-container:focus + .popup-content { /* only for IE/Edge */
    display: block;
  }
}
</style>
