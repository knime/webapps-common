<script>
/**
 * MenuItems component with keyboard navigation and (optional) hotkey text and icons
 * Can be used co create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * A click or activation by keyboard (enter and space) emits `@item-click`.
 * If the data has a to attribute the used tag will be `nuxt-link` if it has a `href` attribute it will be a `a` tag
 * otherwise we use the generic `button` and leave the handling of the action to the wrapping component that reacts
 * to `item-click` and calls any action.
 */
export default {
    props: {
        /**
         * Items to be listed in the menu.
         * Each item has a `text`, optional `icon` and optional `to` / `href` properties, where `to` is for router-links
         * and `href` for standard (e.g. external) links. Items can be disabled with the 'disabled' property.
         * The optional hotkeyText is shown aligned right besides the text if the prop 'showHotkeys' is true.
         * @example
         [{
              href: 'http://apple.com',
              text: 'Apples',
              icon: HelpIcon
              hotkeyText: 'CTRL + H'
           }, {
              href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
              text: 'Oranges',
              icon: StarIcon,
              disabled: true
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
         * Aria Label
         */
        ariaLabel: {
            type: String,
            required: true
        },
        /**
         * Identifier for click handler
         */
        id: {
            default: '',
            type: String
        },
        /**
         * Shows a column on the right of each entry filled with item.hotkeyText (if set).
         * The layout is a bit different even if item does not provide a hotKeyText  (spacing etc.)
         */
        showHotkeys: {
            type: Boolean,
            default: false
        }
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
         * Items can behave as links (either nuxt or native <a>) or buttons.
         * The MenuItems just emit the item-click event.
         *
         * @param {Object} event - browser event.
         * @param {Object} item - submenu item which was clicked.
         * @returns {undefined}
         * @emits {item-click}
         */
        onItemClick(event, item) {
            if (item.disabled) {
                return;
            }
            let isButton = !(item.href || item.to);
            if (isButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            } else if (event.type !== 'click') {
                if (event.code === 'Space') {
                    return;
                }
                // Handle "Enter" on links. Nuxt-link with `to: { name: 'namedRoute' }` do not have an href property
                // and will not automatically react to keyboard events. We must trigger the click to activate the nuxt
                // event listener.
                let newEvent = new Event('click');
                event.target.dispatchEvent(newEvent);
            }
            this.$emit('item-click', event, item, this.id);
        },
        // this method is called by SubMenu; this is required due to the focs based hide
        onArrowUpKey() {
            this.getNextElement(-1).focus();
        },
        // this method is called by SubMenu; this is required due to the focs based hide
        onArrowDownKey() {
            this.getNextElement(1).focus();
        },
        linkTagByType(item) {
            if (item.to) {
                return 'nuxt-link';
            } else if (item.href) {
                return 'a';
            }
            return 'button';
        },
        /**
         * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
         * of the list, this method will return the opposite end.
         *
         * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of items.
         */
        getNextElement(changeInd) {
            let listItems = this.listItems;
            // filter out disabled items
            listItems = listItems.filter(x => !x.classList.contains('disabled'));
            // lookup next item
            return listItems[listItems.indexOf(document.activeElement) + changeInd] || (changeInd < 0
                ? listItems[listItems.length - 1]
                : listItems[0]);
        }
    }
};
</script>

<template>
  <ul
    :aria-label="ariaLabel"
    role="menu"
    tabindex="0"
    @keydown.up.stop.prevent="onArrowUpKey"
    @keydown.down.stop.prevent="onArrowDownKey"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      @click="onItemClick($event, item)"
      @keydown.enter="onItemClick($event, item)"
      @keydown.space="onItemClick($event, item)"
    >
      <Component
        :is="linkTagByType(item)"
        ref="listItem"
        :tabindex="item.disabled ? null: '0'"
        :class="['clickable-item', { disabled: item.disabled }]"
        :to="item.to || null"
        :href="item.href || null"
      >
        <Component
          :is="item.icon"
          v-if="item.icon"
          class="item-icon"
        />
        <div
          v-if="showHotkeys"
          class="label"
        >
          <span class="text">{{ item.text }}</span>
          <span class="hotkey">{{ item.hotkeyText }}</span>
        </div>
        <template v-else>{{ item.text }}</template>
      </Component>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
ul {
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
  z-index: var(--z-index-common-menu-items-expanded, 1);

  &.expanded {
    display: block;
  }

  &:focus {
    outline: none;
  }

  & .clickable-item {
    border: none;
    background: none;
    width: 100%;
    padding: 6px 13px;
    /* <button> does not inherit font-weight from ul in chrome */
    font-weight: 500;
    display: flex;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
    color: var(--theme-text-normal-color);

    &.disabled {
      opacity: 0.5;
      cursor: default;
      pointer-events: none;
    }

    & .item-icon {
      stroke: var(--theme-dropdown-foreground-color);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    & .label {
      display: flex;
      flex: 1;
      text-align: left;
      min-width: 80px;

      & .text {
        flex: 2 1 100%;
        display: block;
      }

      & .hotkey {
        align-self: flex-end;
        display: block;
        flex: 1 1 20%;
        margin-left: 40px;
      }
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

</style>
