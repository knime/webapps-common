<script>
import { createPopper } from '@popperjs/core/dist/esm';
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
        },
        /**
         * Set max-width for the menu and truncate larger text
         */
        maxMenuWidth: {
            type: Number,
            default: null
        },
        /**
         * Allow overflow of the popper on the main axis regarding the SubMenu Button
         */
        allowOverflowMainAxis: {
            type: Boolean,
            default: false
        },
        /**
         * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
         * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
         * has a translate css styling).
         * Whenever the menu is expanded, a callback which closes it again is emitted as the event 'toggle'.
         */
        teleportToBody: {
            type: Boolean,
            default: true
        }
    },
    emits: ['item-click', 'toggle'],
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        popperPlacement() {
            const placementMap = {
                right: 'bottom-end',
                top: 'top-end',
                left: 'bottom-start'
            };
            return placementMap[this.orientation];
        }
    },
    watch: {
        orientation() {
            this.setPopperOrientation();
        }
    },
    mounted() {
        this.activatePopper();
    },
    beforeUnmount() {
        this.destroyPopper();
    },
    methods: {
        activatePopper() {
            const referenceEl = this.$refs.submenu;
            const targetEl = this.$refs['menu-wrapper'];

            this.popperInstance = createPopper(referenceEl, targetEl, {
                placement: this.popperPlacement,
                modifiers: [{
                    name: 'preventOverflow',
                    options: { mainAxis: !this.allowOverflowMainAxis }
                }]
            });
        },
        setPopperOrientation() {
            if (!this.popperInstance) {
                return;
            }

            this.popperInstance.setOptions({
                placement: this.popperPlacement
            });
        },
        destroyPopper() {
            if (this.popperInstance) {
                this.popperInstance.destroy();
            }
        },
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
            if (this.teleportToBody && this.expanded) {
                this.$emit('toggle', () => {
                    this.expanded = false;
                });
            }
            this.popperInstance.update();

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
    <Teleport
      to="body"
      :disabled="!teleportToBody"
    >
      <div
        ref="menu-wrapper"
        :class="['menu-wrapper', { expanded }, { disabled } ]"
      >
        <MenuItems
          :id="id"
          ref="menuItems"
          :class="['menu-items', `orient-${orientation}`]"
          :items="items"
          :max-menu-width="maxMenuWidth"
          aria-label="sub menu"
          @item-click="onItemClick"
        />
      </div>
    </Teleport>
  </div>
</template>

<style lang="postcss" scoped>
.menu-items {
  box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
}

.menu-wrapper {
  position: absolute;
  display: none;
  z-index: var(--z-index-common-menu-items-expanded, 57);

  &.expanded {
    display: block;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
