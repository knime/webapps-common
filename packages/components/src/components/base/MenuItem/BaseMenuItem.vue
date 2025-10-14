<script setup lang="ts">
import Checkbox from "../../forms/Checkbox/Checkbox.vue";

import BaseMenuItemText from "./BaseMenuItemText.vue";
import type { MenuItem } from "./MenuItems.vue";

type Props = {
  item: MenuItem;
  index: number;
  hasFocus: boolean;
  useMaxMenuWidth: boolean;
};

const linkTagByType = (item: MenuItem) => {
  if (item.to) {
    return "nuxt-link";
  } else if (item.href) {
    return "a";
  } else {
    return "button";
  }
};

defineProps<Props>();

const dynamicAttributes = (item: MenuItem) => {
  if (item.href && item.download) {
    return {
      download: typeof item.download === "boolean" ? "" : item.download,
    };
  }
  return null;
};
</script>

<template>
  <Component
    :is="linkTagByType(item)"
    ref="listItemComponent"
    tabindex="-1"
    :class="[
      'list-item',
      item.sectionHeadline ? 'section-headline' : 'clickable-item',
      {
        disabled: item.disabled,
        selected: item.selected,
        focused: hasFocus,
      },
    ]"
    :to="item.to || undefined"
    :href="item.href || undefined"
    v-bind="dynamicAttributes(item)"
  >
    <Component :is="item.icon" v-if="item.icon" class="item-icon" />
    <div class="label">
      <div class="text-and-hotkey">
        <template v-if="item.checkbox">
          <Checkbox :model-value="item.checkbox.checked" class="checkbox">
            <BaseMenuItemText
              :text="item.text"
              :use-max-menu-width="useMaxMenuWidth"
              :hotkey-text="item.hotkeyText"
            />
          </Checkbox>
        </template>
        <template v-else>
          <BaseMenuItemText
            :text="item.text"
            :use-max-menu-width="useMaxMenuWidth"
            :hotkey-text="item.hotkeyText"
            :badge-text="item.badgeText"
          />
          <slot name="submenu" :item-element="$refs.listItemComponent" />
        </template>
      </div>
      <div v-if="item.description" class="description">
        {{ item.description }}
      </div>
    </div>
  </Component>
</template>

<style lang="postcss" scoped>
.list-item {
  --icon-size: 18;

  display: flex;
  width: 100%;
  padding: 6px 13px;

  /* <button> does not inherit font-weight from ul in chrome */
  font-weight: 500;
  color: var(--theme-text-normal-color);
  white-space: nowrap;
  text-decoration: none;
  background: none;
  border: none;

  &.clickable-item {
    cursor: pointer;

    &.disabled {
      pointer-events: none;
      cursor: default;
      opacity: 0.5;
    }

    & .item-icon {
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);
      margin-right: 7px;
      stroke: var(--theme-dropdown-foreground-color);
      stroke-width: calc(32px / var(--icon-size));
    }

    &:hover {
      background-color: var(--theme-dropdown-background-color-hover);
    }

    &.focused {
      color: var(--theme-dropdown-foreground-color-focus);
      outline: transparent;
      background-color: var(--theme-dropdown-background-color-focus);

      & .item-icon {
        stroke: var(--theme-dropdown-foreground-color-focus);
      }

      &:hover {
        color: var(--theme-dropdown-foreground-color-hover);
        background-color: var(--theme-dropdown-background-color-hover);
      }
    }

    &.selected {
      color: var(--theme-dropdown-background-color);
      background-color: var(--theme-dropdown-foreground-color);

      & .item-icon {
        stroke: var(--theme-dropdown-background-color);
      }

      &:hover {
        color: var(--theme-dropdown-foreground-color-hover);
        background-color: var(--theme-dropdown-background-color-hover);

        & .item-icon {
          stroke: var(--theme-dropdown-foreground-color-hover);
        }
      }
    }

    & .label {
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      width: 100%;

      & .text-and-hotkey {
        display: flex;
        align-items: center;
        width: 100%;
        height: calc(var(--icon-size) * 1px);
        text-align: left;

        & .checkbox {
          padding-top: 2px;
          padding-left: 23px; /* Align text horizontally with other items with icons */

          /* center-align text + checkbox in item vertically */
          margin-top: 7px;
        }

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

      & .description {
        width: 100%;
        max-width: 250px;
        font-size: 11px;
        font-weight: 300;
        text-align: left;
        white-space: normal;
      }
    }
  }

  &.section-headline {
    display: flex;
    align-items: center;
    height: 30px;
    padding-top: 13px;
    font-size: 10px;
    line-height: 15px;
    color: var(--knime-stone);
    text-align: left;
    pointer-events: none;

    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }
}
</style>
