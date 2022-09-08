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
 *
 * Hovering or focusing an item emits `@item-active`.
 *
 * By default keyboard navigation wraps around top and bottom.
 * This can be disabled by calling preventDefault on the the events `@top-reached` and `@bottom-reached`
 */
export default {
    props: {
        /**
         * Items to be listed in the menu.
         * Each item has a `text`, optional `icon` and optional `to` / `href` properties, where `to` is for router-links
         * and `href` for standard (e.g. external) links. Items can be disabled with the 'disabled' property.
         * The optional hotkeyText is shown aligned right besides the text if the prop 'showHotkeys' is true.
         * The optional separator will add a separator below the item if it's not the last in the list.
         * @example
         [{
         href: 'http://apple.com',
         text: 'Apples',
         icon: HelpIcon
         hotkeyText: 'CTRL + H',
         }, {
           href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
              text: 'Oranges',
              icon: StarIcon,
              disabled: true,
              separator: true
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
        }
    },
    methods: {
        /**
         * @returns {Array<Element>} - HTML Elements to use for focus and events.
         */
        getEnabledListItems() {
            return this.$refs.listItem.map(el => el.$el || el).filter(x => !x.classList.contains('disabled'));
        },
        /**
         * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
         * of the list, this method will return the opposite end.
         *
         * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of items.
         */
        getNextElement(changeInd) {
            // filter out disabled items
            let listItems = this.getEnabledListItems();
            
            // lookup next item (if none is currently active, start at top or bottom)
            let nextItem = listItems[listItems.indexOf(document.activeElement) + changeInd];
            
            let cancelWrapAround = false;
            if (!nextItem) {
                if (changeInd < 0) {
                    // if before first element, wrap around the list
                    this.$emit('top-reached', { preventDefault: () => {
                        cancelWrapAround = true;
                    } });
                    if (!cancelWrapAround) {
                        nextItem = listItems[listItems.length - 1];
                    }
                } else {
                    // if after last element, wrap around the list
                    this.$emit('bottom-reached', { preventDefault: () => {
                        cancelWrapAround = true;
                    } });
                    if (!cancelWrapAround) {
                        nextItem = listItems[0];
                    }
                }
            }

            return nextItem;
        },
        // publicly accessed
        onArrowUpKey() {
            let nextElement = this.getNextElement(-1);
            if (nextElement) {
                nextElement.focus();
            }
        },
        // publicly accessed
        onArrowDownKey() {
            let nextElement = this.getNextElement(1);
            if (nextElement) {
                nextElement.focus();
            }
        },
        // publicly accessed
        focusFirst() {
            let listItems = this.getEnabledListItems();
            let firstItem = listItems[0];
            if (firstItem) {
                firstItem.focus();
            }
        },
        // publicly accessed
        focusLast() {
            let listItems = this.getEnabledListItems();
            let lastItem = listItems[listItems.length - 1];
            if (lastItem) {
                lastItem.focus();
            }
        },
        linkTagByType(item) {
            if (item.to) {
                return 'nuxt-link';
            } else if (item.href) {
                return 'a';
            } else {
                return 'button';
            }
        },
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
            } else if (event.type !== 'click' && event.code === 'Space') {
                // ignore a "click" through pressing space on links
                return;
            } else if (event.type !== 'click') {
                // Handle "Enter" on links. Nuxt-link with `to: { name: 'namedRoute' }` do not have an href property
                // and will not automatically react to keyboard events. We must trigger the click to activate the nuxt
                // event listener.
                let newEvent = new Event('click');
                event.target.dispatchEvent(newEvent);
            }
            
            this.$emit('item-click', event, item, this.id);
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
    @pointerleave="$emit('item-active', null, id)"
    @focusout="$emit('item-active', null, id)"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="[{ separator: item.separator }]"
      @click="onItemClick($event, item)"
      @keydown.enter="onItemClick($event, item)"
      @keydown.space="onItemClick($event, item)"
      @focusin="$emit('item-active', item.disabled ? null : item, id)"
      @pointerenter="$emit('item-active', item.disabled ? null : item, id)"
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
        <div class="label">
          <span class="text">{{ item.text }}</span>
          <span
            v-if="item.hotkeyText"
            class="hotkey"
          >{{ item.hotkeyText }}</span>
        </div>
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
  z-index: var(--z-index-common-menu-items-expanded, 1);

  &.expanded {
    display: block;
  }

  &:focus {
    outline: none;
  }

  & li:not(:last-child).separator {
    border-bottom: 1px solid var(--knime-porcelain);
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
      stroke-width: calc(32px / 18);
      width: 18px;
      height: 18px;
      margin-right: 7px;
    }

    & .label {
      display: flex;
      text-align: left;
      width: 100%;

      & .text {
        flex-shrink: 1;
        flex-basis: 100%;
      }

      & .hotkey {
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
