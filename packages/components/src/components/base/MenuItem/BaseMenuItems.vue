<script setup lang="ts">
import {
  type StyleValue,
  computed,
  onBeforeUpdate,
  ref,
  toRef,
  watch,
} from "vue";
import {
  type Boundary,
  autoUpdate,
  flip,
  shift,
  useFloating,
} from "@floating-ui/vue";
import { uniqueId } from "lodash-es"; // eslint-disable-line depend/ban-dependencies

import BaseMenuItem from "./BaseMenuItem.vue";
import type { MenuItem } from "./MenuItems.vue";

type ElementTemplateRef = HTMLElement | { $el: HTMLElement };

function isNativeHTMLElement(
  element: ElementTemplateRef,
): element is HTMLElement {
  return !("$el" in element);
}

type Props = {
  items: Array<MenuItem>;
  menuAriaLabel: string;
  focusedItemIndex?: number | null;
  /**
   * Identifier for click handler. If left blank an id is generated.
   * NOTE: Autogenerated IDs might break SSR.
   */
  id?: string;
  /**
   * Maximum width in px of the menu
   */
  maxMenuWidth?: number | null;
  positionRelativeToElement?: HTMLElement | null;
  /**
   * Element used to detect when the MenuItem is near the edges of a clipping parent.
   * This will then be used to automatically position opened floating submenus accordingly.
   *
   * Defaults to the document's body
   */
  clippingBoundary?: Boundary;
};

const props = withDefaults(defineProps<Props>(), {
  focusedItemIndex: null,
  id: () => `__BaseMenuItems-${uniqueId()}__`,
  clippingBoundary: () => document.body,
  maxMenuWidth: null,
  positionRelativeToElement: null,
});

const emit = defineEmits<{
  "item-click": [MouseEvent, MenuItem, string];
  "item-focused": [id: string | null, MenuItem | null];
  "item-hovered": [MenuItem | null, string, number | null];
}>();

// use composition api refs to be able to sync the index between props.items and the refs to the HTMLElement
const listItems = ref<ElementTemplateRef[]>([]);
const positionRelativeToElement = toRef(props, "positionRelativeToElement");
const listContainer = ref<HTMLUListElement>();

onBeforeUpdate(() => {
  listItems.value = [];
});

// position sub level menus
const { floatingStyles } = positionRelativeToElement.value
  ? useFloating(positionRelativeToElement, listContainer, {
      strategy: "fixed",
      placement: "right-start",
      middleware: [
        flip({ boundary: props.clippingBoundary }),
        shift({ boundary: props.clippingBoundary }),
      ],
      whileElementsMounted: autoUpdate,
    })
  : { floatingStyles: null };

const listContainerFloatingStyles = floatingStyles as StyleValue;

const useMaxMenuWidth = computed(() => Boolean(props.maxMenuWidth));

const enabledItemsIndices = computed(() => {
  return props.items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !item.disabled)
    .map(({ index }) => index);
});

const menuItemId = (index: number) => {
  return `menu-item-${props.id}-${index}`;
};

const emitItemFocused = () => {
  if (props.focusedItemIndex === null) {
    emit("item-focused", null, null);
    return;
  }
  const index = props.focusedItemIndex;
  emit("item-focused", menuItemId(index), props.items[index]);
};

watch(
  toRef(props, "focusedItemIndex"),
  () => {
    emitItemFocused();
  },
  { immediate: true },
);

watch(
  toRef(props, "items"),
  () => {
    emitItemFocused();
  },
  { deep: true },
);

const updateItem = (el: HTMLElement, index: number) => {
  listItems.value[index] = el;
};

const getEnabledListItems = () => {
  // const listItems = listItems as Array<HTMLLIElement>;

  return (listItems.value as Array<HTMLLIElement>)
    .map((element, index) => {
      const firstChild = element.children[0] as ElementTemplateRef;

      return {
        element,
        index,
        onClick: isNativeHTMLElement(firstChild)
          ? () => firstChild.click()
          : () => firstChild.$el.click(),
      };
    })
    .filter(({ index }) => enabledItemsIndices.value.includes(index));
};

const scrollTo = (element: HTMLLIElement) => {
  if (
    listContainer.value &&
    listContainer.value.scrollHeight > listContainer.value.clientHeight
  ) {
    const scrollBottom =
      listContainer.value.clientHeight + listContainer.value.scrollTop;
    const elementBottom = element.offsetTop + element.offsetHeight;

    if (elementBottom > scrollBottom) {
      listContainer.value.scrollTop =
        elementBottom - listContainer.value.clientHeight;
    } else if (element.offsetTop < listContainer.value.scrollTop) {
      listContainer.value.scrollTop = element.offsetTop;
    }
  }
};

defineExpose({ scrollTo, getEnabledListItems });

const onPointerEnter = (_event: Event, item: MenuItem, index: number) => {
  emit(
    "item-hovered",
    item.disabled || item.sectionHeadline ? null : item,
    props.id,
    index,
  );
};

const onItemClick = (event: MouseEvent, item: MenuItem, id: string) => {
  if (item.disabled || item.sectionHeadline || item.children?.length) {
    return;
  }

  const isButton = !(item.href || item.to);
  if (isButton) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  }
  if (item.checkbox) {
    const toggledValue = !item.checkbox.checked;
    item.checkbox.setBoolean(toggledValue);
    return;
  }

  emit("item-click", event, item, id);
};
</script>

<template>
  <ul
    ref="listContainer"
    :aria-label="menuAriaLabel"
    class="base-menu-items"
    :style="listContainerFloatingStyles"
    role="menu"
    tabindex="-1"
    @pointerleave="$emit('item-hovered', null, id, null)"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      :ref="(el: any) => updateItem(el, index)"
      :data-index="index"
      :class="[{ separator: item.separator }]"
      :style="useMaxMenuWidth ? { 'max-width': `${maxMenuWidth}px` } : {}"
      :title="item.title"
      @click="onItemClick($event, item, id)"
      @pointerenter="onPointerEnter($event, item, index)"
    >
      <slot
        name="item"
        :item="item"
        :index="index"
        :menu-id="id"
        :menu-item-id="menuItemId"
        :max-menu-width="maxMenuWidth"
        :focused-item-index="focusedItemIndex"
      >
        <BaseMenuItem
          :id="menuItemId(index)"
          :item="item"
          :index="index"
          :use-max-menu-width="Boolean(maxMenuWidth)"
          :has-focus="index === focusedItemIndex"
        />
      </slot>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
.base-menu-items {
  /*
    default to elevation-1, but still allow overriding shadow from outside
    by setting this variable on the component root element's css without having to deep style
   */
  --menu-items-elevation: var(--shadow-elevation-1);

  margin: 0;
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
  box-shadow: var(--menu-items-elevation);

  /* Determine offsetTop of child elements correctly when using the scrollTo method */
  position: relative;

  &.expanded {
    display: block;
  }

  &:focus {
    outline: none;
  }

  & li:not(:last-child).separator {
    border-bottom: 1px solid var(--knime-porcelain);
  }
}
</style>
