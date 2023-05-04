<script setup lang="ts">
import type { MenuItem } from './BaseMenuItems.vue';

type Props = {
    item: MenuItem;
    index: number;
    hasFocus: boolean;
    useMaxMenuWidth: boolean;
}

const linkTagByType = (item: MenuItem) => {
    if (item.to) {
        return 'nuxt-link';
    } else if (item.href) {
        return 'a';
    } else {
        return 'button';
    }
};

const props = defineProps<Props>();

</script>

<template>
  <Component
    :is="linkTagByType(item)"
    ref="listItemComponent"
    tabindex="-1"
    :class="['list-item', item.sectionHeadline ? 'section-headline' : 'clickable-item', {
          disabled: item.disabled, selected: item.selected, focused: hasFocus }]"
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
      <slot name="submenu" :item="item" :index="index" :itemElement="$refs.listItemComponent" />
    </div>
  </Component>
</template>

<style lang="postcss">
.list-item {
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
</style>
