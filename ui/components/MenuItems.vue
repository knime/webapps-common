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

import { ref, type Ref } from 'vue';
import useDropdownNavigation from '../composables/useDropdownNavigation';
import getWrappedAroundIndex from '../util/getWrappedAroundIndex';
import MenuItemsBase from './MenuItemsBase.vue';
import type { MenuItem } from './MenuItemsBase.vue';

type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean,

    /** handles the keyboard nav (register to onKeydown) on its own, useful if you don't require the focus elsewhere */
    registerKeydown?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    disableSpaceToClick: false,
    registerKeydown: false
});

const emit = defineEmits(['close', 'item-click', 'item-focused', 'item-hovered']);
const menuItemsBase: Ref<InstanceType<typeof MenuItemsBase> | null> = ref(null);

const getNextElement = (current: number | null, direction: 1 | -1) => {
    if (!menuItemsBase.value) {
        return { onClick: () => {}, index: -1 };
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
  <MenuItemsBase
    ref="menuItemsBase"
    v-bind="$attrs"
    :items="props.items"
    :menu-aria-label="props.menuAriaLabel"
    :focused-item-index="currentIndex"
    @keydown="props.registerKeydown && onKeydown($event)"
    @item-click="(event, item, id) => $emit('item-click', event, item, id)"
    @item-hovered="(item, id) => $emit('item-hovered', item, id)"
    @item-focused="(...args) => $emit('item-focused', ...args)"
  />
</template>
