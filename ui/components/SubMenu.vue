<script>
import FunctionButton from './FunctionButton';

const BLUR_TIMEOUT = 1;

export default {
    components: {
        FunctionButton
    },
    props: {
        /**
         * Items to be listed in the menu.
         * Each item has a `text`, optional `icon` and optional `to` / `href` properties, where `to` is for router-links
         * and `href` for standard (e.g. external) links.
         * @example
           [{
              href: 'http://apple.com',
              text: 'Apples',
              icon: HelpIcon
           }, {
              href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
              text: 'Oranges',
              icon: StarIcon
           },  {
              to: '/testing-nuxt-link',
              text: 'Ananas'
           }]
         */
        items: {
            required: true,
            type: Array
        },
        /**
         * Identifier for click handler
         */
        id: {
            default: '',
            type: String
        },
        /**
         * Button title
         */
        buttonTitle: {
            default: '',
            type: String
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
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        /**
         * @returns {Array<Element>} - HTML Elements to use for focus and events.
         */
        listItems() {
            return this.$refs.listItem.map(el => el.$el || el);
        }
    },
    methods: {
        /**
         * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
         * of the list, this method will return the opposite end.
         *
         * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of items.
         */
        getNextElement(changeInd) {
            return this.listItems[this.listItems.indexOf(document.activeElement) + changeInd] || (changeInd < 0
                ? this.listItems[this.listItems.length - 1]
                : this.listItems[0]);
        },
        /**
         * Items can behave as links (either nuxt or native <a>) or buttons. If button behavior is expected, we want to
         * prevent bubbling, as well as blur/focus out events. For keyboard navigation, links and buttons need to be
         * treated differently. Buttons should react on 'space' and links on 'enter'.
         *
         * @param {Object} event - browser event.
         * @param {Object} item - submenu item which was clicked.
         * @returns {undefined}
         * @emits {item-click}
         */
        onItemClick(event, item) {
            let isButton = !(item.href || item.to);
            if (isButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                if (event.code === 'Enter') {
                    return;
                }
            } else if (event.type !== 'click') {
                if (event.code === 'Space') {
                    return;
                }
                /* Handle "Enter" on links. Nuxt-link with `to: { name: 'namedRoute' }` do not have an href property
                and will not automatically react to keyboard events. We must trigger the click to activate the nuxt
                event listener. */
                let newEvent = new Event('click');
                event.target.dispatchEvent(newEvent);
            }
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
        /* Handle arrow key "up" events. */
        onUp() {
            if (this.orientation !== 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.getNextElement(-1).focus();
        },
        /* Handle arrow key "down" events. */
        onDown() {
            if (this.orientation === 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.getNextElement(1).focus();
        },
        /* Handle focus leaving events.
         *
         * NOTE: focusout bubbles, so we can use this event to close menu.
         */
        onFocusOut() {
            setTimeout(() => {
                if (this.listItems && !this.listItems.includes(document.activeElement)) {
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
        /*
         * Manually prevents default event bubbling and propagation for methods which fire blur/focusout events that
         * interfere with the refocusing behavior. This allows the timeout to be set extremely low.
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
      :aria-expanded="expanded"
      :disabled="disabled"
      :active="expanded"
      @click.stop.prevent="toggleMenu"
      @keydown.enter="onPreventEvent"
    >
      <slot />
    </FunctionButton>
    <ul
      ref="list"
      aria-label="submenu"
      role="menu"
      :class="[`orient-${orientation}`, { expanded }]"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="onItemClick($event, item)"
        @keydown.enter="onItemClick($event, item)"
        @keydown.space="onItemClick($event, item)"
      >
        <Component
          :is="item.to ? 'nuxt-link' : 'a'"
          ref="listItem"
          tabindex="0"
          class="clickable-item"
          :to="item.to"
          :href="item.href || null"
        >
          <Component
            :is="item.icon"
            v-if="item.icon"
            class="item-icon"
          />
          {{ item.text }}
        </Component>
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

ul {
  display: none;
  position: absolute;
  right: 0;
  margin-top: 8px;
  padding: 0;
  background-color: var(--knime-white);
  color: var(--theme-dropdown-foreground-color);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  font-family: var(--theme-text-medium-font-family);
  text-align: left;
  list-style-type: none;
  box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
  z-index: 1;

  &.expanded {
    display: block;
  }

  &.orient-left {
    right: auto;
    left: 0;
  }

  &.orient-top {
    bottom: 18px;
    right: 10px;
  }

  & a {
    padding: 6px 13px;
    display: flex;
    align-items: center;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;

    & .item-icon {
      stroke: var(--theme-dropdown-foreground-color);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    &:hover {
      outline: none;
      background-color: var(--theme-dropdown-background-color-hover);
      color: var(--theme-dropdown-foreground-color-hover);

      & .item-icon {
        stroke: var(--theme-dropdown-foreground-color-hover);

        & .text {
          stroke: var(--theme-dropdown-foreground-color-hover);
        }
      }
    }

    &:active,
    &:focus {
      outline: none;
      background-color: var(--theme-dropdown-background-color-focus);
      color: var(--theme-dropdown-foreground-color-focus);

      & .item-icon {
        stroke: var(--theme-dropdown-foreground-color-focus);

        & .text {
          stroke: var(--theme-dropdown-foreground-color-focus);
        }
      }
    }
  }
}

.submenu {
  position: relative;

  &.disabled { /* via class since <a> elements don't have a native disabled attribute */
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
