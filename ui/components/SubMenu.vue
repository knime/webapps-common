<script>
import { ref, toRefs, computed, unref, watch } from 'vue';

import FunctionButton from './FunctionButton.vue';
import MenuItems from './MenuItems.vue';
import useDropdownNavigation from '../util/useDropdownNavigation';
import usePopper from '../util/usePopper';
import useClickOutside from '../util/useClickOutside';

const placementMap = {
    right: 'bottom-end',
    top: 'top-end',
    left: 'bottom-start'
};

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
         * Whenever themenu is expanded, a callback which closes it again is emitted as the event 'toggle'.
         */
        teleportToBody: {
            type: Boolean,
            default: true
        }
    },
    emits: ['item-click', 'toggle'],
    setup(props) {
        const { allowOverflowMainAxis, orientation } = toRefs(props);
        const submenu = ref(null);
        const menuItems = ref(null);
        const menuWrapper = ref(null);

        const getNextElement = (current, diff) => menuItems.value.getNextElementWithIndex(current, diff);

        const expanded = ref(false);
        const closeMenu = () => {
            expanded.value = false;
        };

        const { currentMarkedIndex, resetNavigation } = useDropdownNavigation(
            {
                baseElement: submenu,
                getNextElement,
                close: closeMenu
            }
        );

        useClickOutside({ targets: [submenu, menuItems], callback: closeMenu }, expanded);

        const { popperInstance, updatePopper } = usePopper(
            {
                popperTarget: menuWrapper,
                referenceEl: submenu
            },
            computed(() => ({
                placement: placementMap[unref(orientation)],
                strategy: 'fixed',
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            mainAxis: unref(allowOverflowMainAxis)
                        }
                    }
                ]
            }))
        );

        watch(orientation, (value) => {
            const popper = unref(popperInstance);
            if (!popper) {
                return;
            }
            popper.setOptions({
                placement: placementMap[value]
            });
        });
        

        return {
            menuItems,
            submenu,
            menuWrapper,
            expanded,
            resetNavigation,
            currentMarkedIndex,
            updatePopper
        };
    },
    methods: {
        toggleMenu() {
            if (this.disabled) {
                return;
            }
            this.expanded = !this.expanded;
            if (this.teleportToBody && this.expanded) {
                this.$emit('toggle', () => {
                    this.expanded = false;
                });
            }
            this.resetNavigation();
            this.updatePopper();
        },
        onItemClick(event, item) {
            this.$emit('item-click', event, item, this.id);
            this.toggleMenu();
        }
    }
};
</script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { disabled }]"
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
      @click="toggleMenu"
    >
      <slot />
    </FunctionButton>
    <Teleport
      to="body"
      :disabled="!teleportToBody"
    >
      <div
        v-show="expanded"
        ref="menuWrapper"
        :class="['menu-wrapper', { disabled } ]"
      >
        <MenuItems
          :id="id"
          ref="menuItems"
          :marked-item-index="currentMarkedIndex"
          no-focus
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
  z-index: 1000;


  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
