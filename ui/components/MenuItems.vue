<script setup lang="ts">
/**
 * MenuItems component with (optional) hotkey text and icons
 * Can be used to create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * The elements of the menu are not focusable.
 * Instead, the component exposes a onKeydown method, which can be taken as a listener for keydown events on a focused
 * element in a parent component. When doing so, the elements in the menu are marked via keyboard navigation.
 * For accessibility, the focused outside element which listens to keydown events needs to have an aria-activedescendant
 * label set to the id of the visually focused element and additionally an aria-owns label with the same id if the menu items are
 * not DOM-descendants of this element (see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
 * This id is emitted via the `@item-focused` event whenever the visually focused item changes. This emit also yields null whenever no element
 * is visually focused.
 *
 * For some keydown events, a `@close` event is emitted.
 *
 * There is a prop called `registerKeydown` if its true the component is registering the onKeydown method to
 * the @keydown event on its own. This is handy if you don't need to have any control over it
 * (like keeping the focus anywhere).
 *
 * A click or activation by keyboard (enter and space) emits `@item-click`.
 * If the data has a `to` attribute the used tag will be `nuxt-link` if it has a `href` attribute it will be a `a` tag
 * otherwise we use the generic `button` and leave the handling of the action to the wrapping component that reacts
 * to `item-click` and calls any action.
 *
 * Hovering an item emits `@item-hovered`.
 *
 * There is support for sub menus with the `children` key in items. The sublevel menus are recursive and create
 * another MenuItems instance. The keyboard navigation is delegated to the submenu and open/close is handled.
 * Use the selector `:deep(.menu-items-sub-level)` to style the sub menus
 */
import {
  type FunctionalComponent,
  nextTick,
  ref,
  type Ref,
  type SVGAttributes,
} from "vue";
import type { Boundary } from "@floating-ui/vue";

import useDropdownNavigation from "../composables/useDropdownNavigation";
import getWrappedAroundIndex from "../util/getWrappedAroundIndex";
import BaseMenuItems from "./BaseMenuItems.vue";
import BaseMenuItem from "./BaseMenuItem.vue";
import ArrowNextIcon from "../assets/img/icons/arrow-next.svg";

export interface MenuItem<TMetadata = any, TChildrenMetadata = TMetadata> {
  text: string;
  icon?: FunctionalComponent<SVGAttributes>;
  disabled?: boolean;
  /** longer description text that will be displayed below the menu entry but still is part of it */
  description?: string;
  /** shown on menu items on hover */
  title?: string;
  /** for router-links */
  to?: string;
  /** for standard (e.g. external) links */
  href?: string;
  /** adds another styling to the item-font by reducing size and brightening color */
  sectionHeadline?: boolean;
  /** visually emphasizes an item by inverting the color of the item */
  selected?: boolean;
  /** adds a download indicator property for file links */
  download?: boolean | string;
  /** show a separator below the item if it's not the last in the list */
  separator?: boolean;
  /** shown aligned right besides the text */
  hotkeyText?: string;
  /** sub menu */
  children?: Array<MenuItem<TChildrenMetadata>>;
  /** any typed field that can be used to put any data in the item by users of this component */
  metadata?: TMetadata;
  /** If this field is set, the item will be displayed as a checkbox with initial state checkbox.checked, triggering
  checkbox.setBoolean on toggle */
  checkbox?: {
    checked: boolean;
    setBoolean: (checked: boolean) => void;
  };
}

export type Props = {
  items: MenuItem[];
  menuAriaLabel: string;
  disableSpaceToClick?: boolean;
  registerKeydown?: boolean;
  /**
   * Element used to detect when the MenuItem is near the edges of a clipping parent.
   * This will then be used to automatically position opened floating submenus accordingly.
   *
   * Defaults to the document's body
   */
  clippingBoundary?: Boundary;
};

const props = withDefaults(defineProps<Props>(), {
  disableSpaceToClick: false,
  registerKeydown: false,
  clippingBoundary: () => document.body,
});

type Emits = {
  close: [];
  "item-click": [event: MouseEvent, item: MenuItem, menuId: string];
  "item-focused": [itemId: string | null, item: MenuItem | null];
  "item-hovered": [item: MenuItem | null, menuId: string, index: number];
  "close-submenu": [];
};

const emit = defineEmits<Emits>();
const baseMenuItems: Ref<InstanceType<typeof BaseMenuItems> | null> = ref(null);
const openSubmenuItemIndex = ref(-1);
const subLevelItems = ref<any>(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
  if (!baseMenuItems.value) {
    return {
      onClick: () => {},
      index: -1,
    };
  }

  const listItems = baseMenuItems.value.getEnabledListItems();
  let currentIndexInEnabled = listItems
    .map<number | null>(({ index }) => index)
    .indexOf(current);

  if (currentIndexInEnabled === -1 && direction === -1) {
    currentIndexInEnabled = 0;
  }
  const nextIndex = getWrappedAroundIndex(
    currentIndexInEnabled + direction,
    listItems.length,
  );

  const { element, index, onClick } = listItems[nextIndex];
  baseMenuItems.value.scrollTo(element);

  return { index, onClick };
};

const {
  currentIndex,
  onKeydown: onDropdownNavigationKeydown,
  resetNavigation,
} = useDropdownNavigation({
  disableSpaceToClick: props.disableSpaceToClick,
  getNextElement,
  close: () => emit("close"),
});

const focusIndex = (index: number = 0) => {
  currentIndex.value = index;
};

const setOpenSubmenuIndex = (index: number) => {
  const item = props.items[index];
  const isEnabledSubmenuItem = item && !item.disabled && item.children?.length;

  openSubmenuItemIndex.value = isEnabledSubmenuItem ? index : -1;
};

const onKeydownWithOpenCloseSubMenu = (event: KeyboardEvent) => {
  switch (event.code) {
    case "ArrowLeft":
      emit("close-submenu");
      break;
    case "ArrowRight":
      setOpenSubmenuIndex(currentIndex.value ?? 0);
      nextTick(() => {
        subLevelItems.value?.focusIndex();
      });
      break;
  }
  onDropdownNavigationKeydown(event);
};

const onItemHovered = (item: MenuItem | null, id: string, index: number) => {
  if (item !== null) {
    setOpenSubmenuIndex(index);
  }
  emit("item-hovered", item, id, index);
};

const onKeydown = (event: KeyboardEvent) => {
  const isSubmenuOpen = openSubmenuItemIndex.value !== -1;
  if (isSubmenuOpen) {
    subLevelItems.value?.onKeydown(event);
  } else {
    onKeydownWithOpenCloseSubMenu(event);
  }
};

defineExpose({ onKeydown, resetNavigation, focusIndex });

const hasSelectedChildItem = (item: MenuItem) => {
  if (!item.children || item.children.length === 0) {
    return false;
  }

  return Boolean(item.children.find(({ selected }) => selected));
};
</script>

<template>
  <BaseMenuItems
    ref="baseMenuItems"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    :clipping-boundary="clippingBoundary"
    @keydown="props.registerKeydown && onKeydown($event)"
    @item-click="(...args: Emits['item-click']) => $emit('item-click', ...args)"
    @item-hovered="(...args: Emits['item-hovered']) => onItemHovered(...args)"
    @item-focused="
      (...args: Emits['item-focused']) => $emit('item-focused', ...args)
    "
  >
    <template
      #item="{
        item,
        menuId,
        menuItemId,
        index,
        maxMenuWidth,
        focusedItemIndex,
      }"
    >
      <BaseMenuItem
        :id="menuItemId(index)"
        :item="item"
        :index="index"
        :use-max-menu-width="Boolean(maxMenuWidth)"
        :has-focus="index === focusedItemIndex"
        class="base-item"
      >
        <template #submenu="{ itemElement }">
          <span
            v-if="item.children && item.children.length"
            :class="[
              'sub-menu-indicator',
              { highlight: hasSelectedChildItem(item) },
            ]"
          >
            <ArrowNextIcon class="icon" />
            <MenuItems
              v-if="openSubmenuItemIndex === index"
              :id="`${menuId}__sub${index}`"
              ref="subLevelItems"
              class="menu-items-sub-level"
              :menu-aria-label="`${item.text} sub menu`"
              :items="item.children"
              :max-menu-width="maxMenuWidth"
              :position-relative-to-element="itemElement"
              :clipping-boundary="clippingBoundary"
              register-keydown
              @close-submenu="openSubmenuItemIndex = -1"
              @item-click="
                (...args: Emits['item-click']) => $emit('item-click', ...args)
              "
              @item-hovered="
                (...args: Emits['item-hovered']) =>
                  $emit('item-hovered', ...args)
              "
              @item-focused="
                (...args: Emits['item-focused']) =>
                  $emit('item-focused', ...args)
              "
            />
          </span>
        </template>
      </BaseMenuItem>
    </template>
  </BaseMenuItems>
</template>

<style>
.base-item {
  /* base styles for the submenu-indicator */
  & .sub-menu-indicator {
    & .icon {
      width: 12px;
      height: 12px;
      stroke-width: calc(32px / 12);
      pointer-events: none;
      stroke: var(--theme-dropdown-foreground-color);
      vertical-align: middle;
    }
  }

  /* target the base item when it has sub-items  */
  &:has(.sub-menu-indicator.highlight) {
    background-color: var(--theme-dropdown-foreground-color);
    color: var(--theme-dropdown-background-color);

    /* apply styles only for the immediate icon */
    & > .item-icon {
      stroke: var(--theme-dropdown-background-color);
    }

    & .sub-menu-indicator {
      & .icon {
        stroke: var(--theme-dropdown-background-color);
      }
    }
  }

  &:hover:has(.sub-menu-indicator.highlight),
  &.focused:has(.sub-menu-indicator.highlight) {
    color: var(--theme-dropdown-foreground-color-hover);

    & > .item-icon {
      stroke: var(--theme-dropdown-foreground-color-hover);
    }

    & .sub-menu-indicator {
      & .icon {
        stroke: var(--theme-dropdown-foreground-color-hover);
      }
    }
  }
}
</style>
