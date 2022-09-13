<script>
import FunctionButton from './FunctionButton.vue';
import MenuItems from './MenuItems.vue';

const BLUR_TIMEOUT = 1;

/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
export default {
    components: {
        FunctionButton,
        MenuItems
    },
    props: {
        /**
         * Items to be listed in the menu.
         * See MenuItems for more details.
         */
        items: {
            type: Array,
            required: true
        },
        /**
         * Identifier for click handler
         */
        id: {
            type: String,
            default: ''
        },
        /**
         * Button title
         */
        buttonTitle: {
            type: String,
            default: ''
        },
        /**
         * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
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
    emits: ['item-click'],
    data() {
        return {
            expanded: false
        };
    },
    methods: {
        /**
         * Close the menu if item was clicked (or activated by keyboard)
         *
         * @param {Object} event - browser event.
         * @param {Object} item - submenu item which was clicked.
         * @returns {undefined}
         * @emits {item-click}
         */
        onItemClick(event, item) {
            this.$emit('item-click', event, item, this.id);
            this.closeMenu();
        },
        toggleMenu() {
            this.expanded = !this.expanded;
            setTimeout(() => {
                if (this.$refs['submenu-toggle']) {
                    this.$refs['submenu-toggle'].focus();
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Handle arrow key "up" events.
         *
         * @param {Event} e
         * @returns {undefined}
         */
        onUp(e) {
            if (this.orientation !== 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.$refs.menuItems.onArrowUpKey(e);
        },
        /**
         * Handle arrow key "down" events.
         *
         * @param {Event} e
         * @returns {undefined}
         */
        onDown(e) {
            if (this.orientation === 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.$refs.menuItems.onArrowDownKey(e);
        },
        /**
         * Handle focus leaving events.
         * NOTE: focusout bubbles, so we can use this event to close menu.
         * @return {undefined}
         */
        onFocusOut() {
            setTimeout(() => {
                const menuItems = this.$refs.menuItems;
                if (menuItems && menuItems.$el && !menuItems.$el.contains(document.activeElement)) {
                    this.closeMenu(false);
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Handle closing the menu.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should be re-focused after closing.
         * @return {undefined}
         */
        closeMenu(refocusToggle = true) {
            setTimeout(() => {
                this.expanded = false;
                if (refocusToggle && this.$refs['submenu-toggle']) {
                    this.$refs['submenu-toggle'].focus();
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Manually prevents default event bubbling and propagation for methods which fire blur/focusout events that
         * interfere with the refocusing behavior. This allows the timeout to be set extremely low.
         * @param {Event} event
         * @return {undefined}
         */
        onPreventEvent(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }
};
</script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { disabled }]"
    @keydown.esc.stop.prevent="closeMenu"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
    @mousedown="onPreventEvent"
  >
    <FunctionButton
      ref="submenu-toggle"
      aria-haspopup="true"
      type="button"
      :title="buttonTitle"
      :class="['submenu-toggle', { expanded }]"
      :aria-expanded="String(expanded)"
      :disabled="disabled"
      :active="expanded"
      @click.stop.prevent="toggleMenu"
      @keydown.enter="onPreventEvent"
    >
      <slot />
    </FunctionButton>
    <div :class="['menu-wrapper', { expanded }, { disabled } ]">
      <MenuItems
        :id="id"
        ref="menuItems"
        :class="['menu-items', `orient-${orientation}`]"
        :items="items"
        aria-label="sub menu"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu-items {
  box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
  position: absolute;
  right: 0;

  &.orient-left {
    right: auto;
    left: 0;
  }

  &.orient-top {
    bottom: 18px;
    right: 10px;
  }
}

.menu-wrapper {
  position: relative;
  display: none;

  &.expanded {
    display: block;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
