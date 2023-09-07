<script setup lang="ts">
import type { MenuItem } from "./MenuItems.vue";
import Checkbox from "./forms/Checkbox.vue";
import BaseMenuItemText from "./BaseMenuItemText.vue";

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
    :to="item.to || null"
    :href="item.href || null"
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
      stroke-width: calc(32px / var(--icon-size));
      width: calc(var(--icon-size) * 1px);
      height: calc(var(--icon-size) * 1px);
      margin-right: 7px;
    }

    &.selected {
      background-color: var(--theme-dropdown-foreground-color);
      color: var(
        --theme-dropdown-background-color
      ); /* background and foreground are switched on selection */

      & .item-icon {
        stroke: var(--theme-dropdown-background-color);
      }
    }

    & .label {
      display: flex;
      flex-direction: column;
      align-content: flex-start;
      width: 100%;

      & .text-and-hotkey {
        display: flex;
        text-align: left;
        width: 100%;
        height: calc(var(--icon-size) * 1px);
        align-items: center;

        & .checkbox {
          margin-top: 7px;
          padding-left: 23px;
          padding-top: 2px;
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
        max-width: 250px;
        width: 100%;
        text-align: left;
        white-space: normal;
        font-size: 11px;
        font-weight: 300;
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
    text-align: left;

    &:hover,
    &:focus,
    &:active {
      outline: none;
    }
  }
}
</style>
