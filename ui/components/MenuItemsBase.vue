<script lang="ts">
import type { PropType, FunctionalComponent, SVGAttributes } from 'vue';

export interface MenuItem {
  text: string;
  icon?: FunctionalComponent<SVGAttributes>;
  disabled?: boolean;
  /* shown on menu items on hover */
  title?: string;
  /* for router-links */
  to?: string;
  /* for standard (e.g. external) links */
  href?: string;
  /* adds another styling to the item-font by reducing size and brightening color */
 sectionHeadline?: boolean;
  /* visually emphasizes an item by inverting the color of the item */
  selected?: boolean;
  /* show a separator below the item if it's not the last in the list */
  separator?: boolean;
  /* shown aligned right besides the text */
  hotkeyText?: string;
}

export default {
    props: {
        items: {
            type: Array as PropType<Array<MenuItem>>,
            required: true
        },
        focusedItemIndex: {
            required: false,
            type: Number as PropType<number|null>,
            default: null
        },
        menuAriaLabel: {
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
         * Maximum width in px of the menu
         */
        maxMenuWidth: {
            type: Number,
            default: null
        }
    },
    emits: ['item-click', 'arrow-down', 'arrow-up', 'item-focused', 'item-hovered'],
    computed: {
        useMaxMenuWidth() {
            return Boolean(this.maxMenuWidth);
        },
        enabledItemsIndices() {
            return this.items.map((item, index) => ({ item, index }))
                .filter(({ item }) => !item.disabled)
                .map(({ index }) => index);
        }
    },
    watch: {
        focusedItemIndex: {
            immediate: true,
            handler(i) {
                // eslint-disable-next-line no-undefined
                this.$emit('item-focused', i === null ? null : this.menuItemId(i));
            }
        }
    },
    expose: ['getEnabledListItems'],
    methods: {
        getEnabledListItems() {
            const listItems = this.$refs.listItem as (Element & {$el: undefined}|{$el: Element})[];
            return listItems.map((el, index) => ({ element: el.$el || el, index }))
                .filter(({ index }) => this.enabledItemsIndices.includes(index));
        },
        linkTagByType(item: MenuItem) {
            if (item.to) {
                return 'nuxt-link';
            } else if (item.href) {
                return 'a';
            } else {
                return 'button';
            }
        },
        menuItemId(index: number) {
            return `menu-item-${this.id}-${index}`;
        },
        onItemClick(event: Event, item: MenuItem) {
            if (item.disabled || item.sectionHeadline) {
                return;
            }

            let isButton = !(item.href || item.to);
            if (isButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
            this.$emit('item-click', event, item, this.id);
        }
    }
};
</script>

<template>
  <ul
    :aria-label="menuAriaLabel"
    role="menu"
    tabindex="0"
    @pointerleave="$emit('item-hovered', null, id)"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="[{ separator: item.separator }]"
      :style="useMaxMenuWidth ? { 'max-width': `${maxMenuWidth}px` } : {}"
      :title="item.title"
      @click="onItemClick($event, item)"
      @pointerenter="$emit('item-hovered', item.disabled || item.sectionHeadline ? null : item, id)"
    >
      <Component
        :is="linkTagByType(item)"
        :id="menuItemId(index)"
        ref="listItem"
        tabindex="-1"
        :class="['list-item', item.sectionHeadline ? 'section-headline' : 'clickable-item', {
          disabled: item.disabled, selected: item.selected, focused: index === focusedItemIndex }]"
        :to="item.to || null"
        :href="item.href || null"
      >
        <Component
          :is="item.icon"
          v-if="item.icon"
          class="item-icon"
        />
        <div class="label">
          <span :class="['text', { truncate: useMaxMenuWidth }]">
            {{ item.text }}
          </span>
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
  margin: 5px 0;
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

  & .list-item {
    border: none;
    background: none;
    width: 100%;
    padding: 6px 13px;

    /* <button> does not inherit font-weight from ul in chrome */
    font-weight: 500;
    display: flex;
    text-decoration: none;
    white-space: nowrap;
    color: var(--theme-text-normal-color);

    &.clickable-item {
      cursor: pointer;

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

      &.selected {
        background-color: var(--theme-dropdown-foreground-color);
        color: var(--theme-dropdown-background-color); /* background and foreground are switched on selection */

        & .item-icon {
          stroke: var(--theme-dropdown-background-color);
        }
      }

      & .label {
        display: flex;
        text-align: left;
        width: 100%;

        & .text {
          flex-shrink: 1;
          flex-basis: 100%;

          &.truncate {
            overflow: hidden;
            text-overflow: ellipsis;
          }
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

      &.focused {
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

    &.section-headline {
      color: var(--knime-stone);
      padding-top: 13px;
      pointer-events: none;
      height: 30px;
      font-size: 10px;
      line-height: 15px;
      display: flex;
      align-items: center;

      &:hover,
      &:focus,
      &:active {
        outline: none;
      }
    }
  }
}
</style>
