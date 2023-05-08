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

import { nextTick, ref, type Ref } from 'vue';
import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import BaseMenuItems from './BaseMenuItems.vue';
import type { MenuItem } from './BaseMenuItems.vue';
import BaseMenuItem from './BaseMenuItem.vue';
import ArrowNextIcon from '../assets/img/icons/arrow-next.svg';

type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean,
    registerKeydown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disableSpaceToClick: false,
    registerKeydown: false
});

interface Emits {
    (e: 'close'): void
    (e: 'item-click', event: MouseEvent, item: MenuItem, id: string): void
    (e: 'item-focused', item: MenuItem|null, id: string|null): void
    (e: 'item-hovered', item: MenuItem|null, id: string, index: number): void
    (e: 'close-submenu'): void
}

const emit = defineEmits<Emits>();
const baseMenuItems: Ref<InstanceType<typeof BaseMenuItems> | null> = ref(null);
const openSubmenuItemIndex = ref(-1);
const subLevelItems = ref<any>(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
    if (!baseMenuItems.value) {
        return {
            onClick: () => {
            },
            index: -1
        };
    }

    const listItems = baseMenuItems.value.getEnabledListItems();
    let currentIndexInEnabled = listItems
        .map<number | null>(({ index }) => index)
        .indexOf(current);

    if (currentIndexInEnabled === -1 && direction === -1) {
        currentIndexInEnabled = 0;
    }
    const nextIndex = getWrappedAroundIndex(currentIndexInEnabled + direction, listItems.length);

    const { element, index, onClick } = listItems[nextIndex];
    baseMenuItems.value.scrollTo(element);

    return { index, onClick };
};

const { currentIndex, onKeydown: onDropdownNavigationKeydown, resetNavigation } = useDropdownNavigation({
    disableSpaceToClick: props.disableSpaceToClick,
    getNextElement,
    close: () => emit('close')
});

const focusIndex = (index: number = 0) => {
    currentIndex.value = index;
};

const setOpenSubmenuIndex = (index: number) => {
    const item = props.items.at(index);
    const isEnabledSubmenuItem = item && !item.disabled && item.children?.length;

    openSubmenuItemIndex.value = isEnabledSubmenuItem ? index : -1;
};

const onKeydownWithOpenCloseSubMenu = (event: KeyboardEvent) => {
    switch (event.code) {
        case 'ArrowLeft':
            emit('close-submenu');
            break;
        case 'ArrowRight':
            setOpenSubmenuIndex(currentIndex.value || 0);
            nextTick(() => {
                subLevelItems.value?.focusIndex();
            });
            break;
    }
    onDropdownNavigationKeydown(event);
};

const onItemHovered = (item: MenuItem, id: string, index: number) => {
    if (item !== null) {
        setOpenSubmenuIndex(index);
    }
    emit('item-hovered', item, id, index);
};

const onKeydown = (event: KeyboardEvent) => {
    const isSubmenuOpen = openSubmenuItemIndex.value === -1;
    if (isSubmenuOpen) {
        onKeydownWithOpenCloseSubMenu(event);
    } else {
        subLevelItems.value?.onKeydown(event);
    }
};

defineExpose({ onKeydown, resetNavigation, focusIndex });
</script>

<script lang="ts">
/* re-export MenuItem type */
export type { MenuItem } from './BaseMenuItems.vue';
</script>

<template>
  <BaseMenuItems
    ref="baseMenuItems"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    @keydown="props.registerKeydown && onKeydown($event)"
    @item-click="(event, item, id) => $emit('item-click', event, item, id)"
    @item-hovered="(item, id, index) => onItemHovered(item, id, index)"
    @item-focused="(...args) => $emit('item-focused', ...args)"
  >
    <template #item="{ item, menuId, menuItemId, index, maxMenuWidth, focusedItemIndex }">
      <BaseMenuItem
        :id="menuItemId(index)"
        :item="item"
        :index="index"
        :use-max-menu-width="Boolean(maxMenuWidth)"
        :has-focus="index === focusedItemIndex"
      >
        <template #submenu="{ itemElement }">
          <span
            v-if="item.children && item.children.length"
            class="sub-menu-indicator"
          >
            <ArrowNextIcon class="icon" />
            <MenuItems
              v-if="openSubmenuItemIndex === index"
              :id="`${menuId}__sub${index}`"
              ref="subLevelItems"
              class="menu-items-level"
              :menu-aria-label="`${item.text} sub menu`"
              :items="item.children"
              :max-menu-width="maxMenuWidth"
              :position-relative-to-element="itemElement"
              register-keydown
              @close-submenu="openSubmenuItemIndex = -1"
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
