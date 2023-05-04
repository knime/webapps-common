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
 * A click or activation by keyboard (enter and space) emits `@item-click`.
 * If the data has a `to` attribute the used tag will be `nuxt-link` if it has a `href` attribute it will be a `a` tag
 * otherwise we use the generic `button` and leave the handling of the action to the wrapping component that reacts
 * to `item-click` and calls any action.
 *
 * Hovering an item emits `@item-hovered`.
 */

import { onMounted, ref, type Ref } from 'vue';
import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import BaseMenuItems from './BaseMenuItems.vue';
import type { MenuItem } from './BaseMenuItems.vue';
import BaseMenuItem from "./BaseMenuItem.vue";
import ArrowNextIcon from "../assets/img/icons/arrow-next.svg";

/* re-export MenuItem type */
export type { MenuItem };

type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean,

    /** handles the keyboard nav (register to onKeydown) on its own, useful if you don't require the focus elsewhere */
    registerKeydown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disableSpaceToClick: false,
    registerKeydown: false,
    focusOnMount: false
});

const emit = defineEmits(['close', 'item-click', 'item-focused', 'item-hovered']);
const menuItemsBase: Ref<InstanceType<typeof BaseMenuItems> | null> = ref(null);
const openSubmenuItemIndex = ref(-1);

const setOpenSubmenuIndex = (index: Number) => {
    const item = props.items.at(index);
    if (item && !item.disabled && item.children?.length) {
        openSubmenuItemIndex.value = index;
    } else {
        openSubmenuItemIndex.value = -1;
    }
};

const onItemHovered = ({ item, id, index }) => {
    setOpenSubmenuIndex(index);
    emit('item-hovered', item, id);
};

const getNextElement = (current: number | null, direction: 1 | -1) => {
    if (!menuItemsBase.value) {
        return {
            onClick: () => {
            }, index: -1
        };
    }

    const listItems = menuItemsBase.value.getEnabledListItems();
    let currentIndexInEnabled = listItems
        .map<number | null>(({ index }) => index)
        .indexOf(current);

    if (currentIndexInEnabled === -1 && direction === -1) {
        currentIndexInEnabled = 0;
    }
    const nextIndex = getWrappedAroundIndex(currentIndexInEnabled + direction, listItems.length);

    const { element, index, onClick } = listItems[nextIndex];
    menuItemsBase.value.scrollTo(element);

    return { index, onClick };
};

const { currentIndex, onKeydown, resetNavigation } = useDropdownNavigation({
    disableSpaceToClick: props.disableSpaceToClick,
    getNextElement,
    close: () => emit('close')
});

defineExpose({ onKeydown, resetNavigation });
</script>

<template>
  <BaseMenuItems
    ref="menuItemsBase"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    @keydown="props.registerKeydown && onKeydown($event)"
    @item-click="(event, item, id) => $emit('item-click', event, item, id)"
    @item-hovered="(item, id, index) => onItemHovered({ item, id, index })"
    @item-focused="(...args) => $emit('item-focused', ...args)"
    @keydown.right="setOpenSubmenuIndex(currentIndex)"
    @keydown.left="setOpenSubmenuIndex(-1)"
  >
    <template #item="{ item, menuId, menuItemId, index, maxMenuWidth, focusedItemIndex }">
      <BaseMenuItem
        :id="menuItemId(index)"
        :item="item"
        :index="index"
        :use-max-menu-width="Boolean(maxMenuWidth)"
        :has-focus="index === focusedItemIndex"
      >
        <template #submenu="{ item, index, itemElement }">
          <span
            v-if="item.children && item.children.length"
            class="sub-menu-indicator"
          >
            <ArrowNextIcon class="icon" />
            <MenuItems
              v-if="openSubmenuItemIndex === index"
              :id="`${menuId}__${item.name}`"
              class="menu-items-level"
              :menu-aria-label="`${item.text} sub menu`"
              :items="item.children"
              :max-menu-width="maxMenuWidth"
              :position-relative-to-element="itemElement"
              register-keydown
              @item-click="(...args) => $emit('item-click', ...args)"
              @item-hovered="(...args) => $emit('item-hovered', ...args)"
              @item-focused="(...args) => $emit('item-focused', ...args)"
            />
          </span>
        </template>
      </BaseMenuItem>
    </template>
  </BaseMenuItems>
</template>

<style>
.sub-menu-indicator {
  & .icon {
    width: 11px;
    height: 11px;
    stroke-width: calc(32px / 11);
    pointer-events: none;
    stroke: var(--theme-dropdown-foreground-color);
  }
}
</style>
