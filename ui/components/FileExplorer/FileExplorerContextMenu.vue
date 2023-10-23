<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, toRef } from "vue";
import { directive as vClickAway } from "vue3-click-away";

import type { MenuItem as BaseMenuItem } from "../MenuItems.vue";
import MenuItems from "../MenuItems.vue";
import usePopper from "../../composables/usePopper";

import type { FileExplorerItem, FileExplorerContextMenu } from "./types";

interface Props {
  position: { x: number; y: number };
  anchor: FileExplorerContextMenu.Anchor;
  selectedItems: Array<FileExplorerItem>;
}

const props = defineProps<Props>();

const element = ref(props.anchor.element);
const referenceRect = element.value.getBoundingClientRect();
const menuWrapper = ref<HTMLElement | null>(null);
const shouldShowMenu = ref(true);

const wrapperHeight = computed(() => {
  if (!menuWrapper.value) {
    return 0;
  }

  return menuWrapper.value.getBoundingClientRect().height;
});

let intersectionObserver: IntersectionObserver;

onMounted(() => {
  // prevent menu from being shown if anchor element is out of view
  intersectionObserver = new IntersectionObserver(([entry]) => {
    shouldShowMenu.value = entry.isIntersecting;
  });

  intersectionObserver.observe(props.anchor.element);
});

onUnmounted(() => {
  intersectionObserver.disconnect();
});

const offsetX = computed(() => {
  const referenceRect = element.value.getBoundingClientRect();
  return props.position.x - referenceRect.left;
});

const offsetY = computed(() => {
  const clickPosition = props.position.y - referenceRect.top;
  const distanceToBottom = window.innerHeight - props.position.y;
  const isClipped = distanceToBottom < wrapperHeight.value;

  // when the menu is being clipped by the bottom, invert its
  // positioning by increasing the Y axis offset. This is relevant only
  // for the last items at the end of a large scrollable container
  return isClipped
    ? clickPosition * -1
    : (clickPosition + wrapperHeight.value) * -1;
});

const popperOffsetModifier = computed(() => ({
  name: "offset",
  options: { offset: [offsetX.value, offsetY.value] },
}));

const { popperInstance } = usePopper(
  {
    popperTarget: menuWrapper,
    referenceEl: element,
  },
  {
    placement: "top-start",
    strategy: "fixed",
    modifiers: [popperOffsetModifier.value],
  },
);

const repositionPopper = async () => {
  // by re-setting the modifiers we update the offset which will reposition the popper
  await popperInstance.value?.setOptions({
    modifiers: [popperOffsetModifier.value],
  });
};

watch(wrapperHeight, async () => {
  await repositionPopper();
});

watch(
  toRef(props, "position"),
  async () => {
    await repositionPopper();
  },
  { deep: true },
);

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

const items: Array<FileExplorerContextMenu.MenuItem> = [
  createRenameOption(props.anchor.item),
  createDeleteOption(props.anchor.item),
];

const closeMenu = () => {
  popperInstance.value?.destroy();
  emit("close");
};
</script>

<template>
  <div
    v-show="shouldShowMenu"
    ref="menuWrapper"
    v-click-away="() => closeMenu()"
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
        :items="items"
        @item-click="(_, item) => onItemClick(item)"
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
