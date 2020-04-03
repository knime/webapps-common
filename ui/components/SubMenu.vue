<script>
const BLUR_TIMEOUT = 50;

export default {
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
         * Identifier for clickhandler
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
         * Alignment of the submenu with the menu button
         * left or right. Defaults to 'right'.
         */
        orientation: {
            type: String,
            default: 'right',
            validator(orientation = 'right') {
                return ['right', 'left', 'top'].includes(orientation);
            }
        }
    },
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        /**
         * @returns {Array} - HTML elements to use for focus and events.
         */
        listItems() {
            return this.$refs.listItem.map(el => el.$el || el);
        }
    },
    methods: {
        /**
         * Returns the next HTML element from the list of items. If the current focused element is at an end of
         * the list (either first [0], or last [listItems.length - 1]) this method will return the the opposite
         * end ([listItems.length - 1] or [0] respectively).
         *
         * @param {Number} changeInd - the positive or negative index shift for the next element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of items.
         */
        getNextElement(changeInd) {
            return this.listItems[this.listItems.indexOf(document.activeElement) + changeInd] || (changeInd < 0
                ? this.listItems[this.listItems.length - 1]
                : this.listItems[0]);
        },
        /**
         * Handle item click.
         *
         * Items can behave as links (either nuxt or native <a>) or
         * buttons. If button behavior is expected, we want to prevent
         * bubbling, as well as blur/focus out events. For keyboard
         * navigation, links and buttons need to be treated differently.
         * Buttons should react on 'space' and links on 'enter'.
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
                /* Handle "Enter" on links. Nuxt-link with `to: { name:
                'namedRoute' }` do not have an href property and will
                not automatically react to keyboard events. We must
                trigger the click to activate the nuxt eventListener. */
                let newEvent = new Event('click');
                event.target.dispatchEvent(newEvent);
            }
            this.$emit('item-click', event, item, this.id);
            this.closeMenu();
        },
        toggleMenu() {
            this.expanded = !this.expanded;
        },
        /* Handle arrow key "up" events. */
        onUp() {
            if (this.orientation !== 'top' && document.activeElement === this.$refs['submenu-toggle']) {
                return;
            }
            this.getNextElement(-1).focus();
        },
        /* Handle arrow key "down" events. */
        onDown() {
            if (this.orientation === 'top' && document.activeElement === this.$refs['submenu-toggle']) {
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
                if (this.listItems.indexOf(document.activeElement) === -1) {
                    this.closeMenu(false);
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Handle closing the menu.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should
         *    be re-focused after closing.
         * @return {undefined}
         */
        closeMenu(refocusToggle = true) {
            setTimeout(() => {
                this.expanded = false;
                if (refocusToggle) {
                    this.$refs['submenu-toggle'].focus();
                }
            }, BLUR_TIMEOUT);
        }
    }
};
</script>

<template>
  <div
    ref="submenu"
    class="submenu"
    @keydown.esc.stop.prevent="closeMenu"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
  >
    <!--"@keydown.enter.self.prevent" needed to silence enter key events which incorrectly fire w/ @click.
      On native <button> elem, click event cannot be differentiated as enter or click (Vue issue).-->
    <button
      ref="submenu-toggle"
      aria-haspopup="true"
      tabindex="0"
      type="button"
      :title="buttonTitle"
      :class="['submenu-toggle', { expanded }]"
      :aria-expanded="expanded"
      @click.stop.prevent="toggleMenu"
      @keydown.space.stop.prevent="toggleMenu"
      @keydown.enter.self.prevent=""
    >
      <slot />
    </button>
    <ul
      ref="list"
      aria-label="submenu"
      role="menu"
      :class="[`orient-${orientation}`, { expanded }]"
    >
      <li
        v-for="(item, index) in items"
        :key="index"
        @click="onItemClick($event, item, index)"
        @keydown.enter="onItemClick($event, item, index)"
        @keydown.space="onItemClick($event, item, index)"
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

button {
  display: block;
  color: inherit;
  font-weight: inherit;
  background: transparent;
  padding: 0;
  border: 0 none;
  text-decoration: none;
  cursor: pointer;

  &:active,
  &:hover,
  &:focus {
    outline: none;
  }
}

ul {
  display: none;
  position: absolute;
  right: 0;
  margin-top: 8px;
  padding: 5px 0;
  background-color: var(--theme-color-white);
  color: var(--theme-color-dove-gray);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  text-align: left;
  list-style-type: none;
  box-shadow: 0 1px 4px 0 var(--theme-color-gray-dark-semi);
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
      stroke: var(--theme-color-masala);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    &:active,
    &:hover,
    &:focus {
      outline: none;
      background-color: var(--theme-color-masala);
      color: var(--theme-color-white);

      & .item-icon {
        stroke: var(--theme-color-white);

        & .text {
          stroke: var(--theme-color-white);
        }
      }
    }
  }
}

.submenu {
  position: relative;
}
</style>
