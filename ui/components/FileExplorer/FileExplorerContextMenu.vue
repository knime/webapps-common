<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs, watch } from "vue";

import type { MenuItem as BaseMenuItem } from "../MenuItems.vue";
import MenuItems from "../MenuItems.vue";
import { useFloating, autoUpdate, offset } from "@floating-ui/vue";

import type { FileExplorerItem, FileExplorerContextMenu } from "./types";
import { onClickOutside } from "@vueuse/core";

interface Props {
  position: { x: number; y: number };
  anchor: FileExplorerContextMenu.Anchor;
  selectedItems: Array<FileExplorerItem>;
}

const props = defineProps<Props>();

const { position } = toRefs(props);
const element = computed(() => props.anchor.element);
const menuWrapper = ref<HTMLElement | null>(null);
const shouldShowMenu = ref(true);

const wrapperHeight = computed(
  () => menuWrapper.value?.getBoundingClientRect()?.height ?? 0,
);

let intersectionObserver: IntersectionObserver;

onMounted(() => {
  // prevent menu from being shown if anchor element is out of view
  intersectionObserver = new IntersectionObserver(([entry]) => {
    shouldShowMenu.value = entry.isIntersecting;
  });

  intersectionObserver.observe(props.anchor.element);

  if (shouldShowMenu.value) {
    const focusableElement = menuWrapper.value?.querySelector(
      '[tabindex="-1"]',
    ) as HTMLElement;
    focusableElement?.focus();
  }
});

onUnmounted(() => {
  intersectionObserver.disconnect();
});

const offsetX = computed(() => {
  const referenceRect = element.value.getBoundingClientRect();
  return props.position.x - referenceRect.left;
});

const offsetY = computed(() => {
  const referenceRect = element.value.getBoundingClientRect();
  const clickPosition = props.position.y - referenceRect.top;
  const distanceToBottom = window.innerHeight - props.position.y;
  const isClipped = distanceToBottom < wrapperHeight.value;

  // when the menu is being clipped by the bottom, invert its
  // positioning by increasing the Y axis offset. This is relevant only
  // for the last items at the end of a large scrollable container
  return (isClipped ? clickPosition : clickPosition + wrapperHeight.value) * -1;
});

const middleware = computed(() => [
  offset({ mainAxis: offsetY.value, crossAxis: offsetX.value }),
]);

const { floatingStyles, update: updateFloating } = useFloating(
  element,
  menuWrapper,
  {
    placement: "top-start",
    strategy: "fixed",
    middleware,
    whileElementsMounted: autoUpdate,
  },
);

watch(position, () => updateFloating(), { deep: true });

watch(wrapperHeight, () => {
  updateFloating();
});

const emit = defineEmits<{
  (e: "itemClick", payload: FileExplorerContextMenu.ItemClickPayload): void;
  (e: "close"): void;
}>();

const createRenameOption: FileExplorerContextMenu.CreateDefaultMenuOption = (
  item,
  customProps = {},
) => ({
  id: "rename",
  text: "Rename",
  ...customProps,
  disabled:
    !item.canBeRenamed ||
    props.selectedItems.length > 1 ||
    customProps.disabled ||
    false,
});

const createDeleteOption: FileExplorerContextMenu.CreateDefaultMenuOption = (
  item,
  customProps = {},
) => {
  const hasNonDeletableItem = props.selectedItems.some(
    (item) => !item.canBeDeleted,
  );

  return {
    id: "delete",
    text: "Delete",
    ...customProps,
    disabled:
      !item.canBeDeleted ||
      hasNonDeletableItem ||
      customProps.disabled ||
      false,
  };
};

const onItemClick = (menuItem: BaseMenuItem) => {
  const contextMenuItem = menuItem as FileExplorerContextMenu.MenuItem;
  const { id } = contextMenuItem;

  const isRename = id === "rename";
  const isDelete = id === "delete";

  if (
    (isRename && !props.anchor.item.canBeRenamed) ||
    (isDelete && !props.anchor.item.canBeDeleted)
  ) {
    return;
  }

  emit("itemClick", {
    contextMenuItem,
    anchorItem: props.anchor.item,
    isDelete,
    isRename,
  });
};

const items = computed(() => [
  createRenameOption(props.anchor.item),
  createDeleteOption(props.anchor.item),
]);

const closeMenu = () => {
  emit("close");
};

onClickOutside(menuWrapper, closeMenu);
</script>

<template>
  <div
    v-show="shouldShowMenu"
    ref="menuWrapper"
    :style="floatingStyles"
    class="menu-wrapper"
  >
    <slot
      :items="items"
      :create-rename-option="createRenameOption"
      :create-delete-option="createDeleteOption"
      :on-item-click="onItemClick"
    >
      <MenuItems
        menu-aria-label="File explorer context menu"
        register-keydown
        :items="items"
        @close="closeMenu"
        @item-click="(_: MouseEvent, item: BaseMenuItem) => onItemClick(item)"
      />
    </slot>
  </div>
</template>

<style lang="postcss" scoped>
.menu-wrapper {
  position: absolute;
  z-index: 5;
  left: calc(v-bind("$props.position.x") * 1px);
  top: calc(v-bind("$props.position.y") * 1px);
}
</style>
