<script setup lang="ts">
import { ref, toRefs, toRef, computed, watch, nextTick } from "vue";

import { useItemDragging } from "./useItemDragging";
import { useMultiSelection } from "./useMultiSelection";
import FileExplorerContextMenu from "./FileExplorerContextMenu.vue";
import FileExplorerItem from "./FileExplorerItem.vue";
import FileExplorerItemBack from "./FileExplorerItemBack.vue";
import type {
  FileExplorerItem as FileExplorerItemType,
  FileExplorerContextMenu as FileExplorerContextMenuNamespace,
  ItemIconRenderer,
} from "./types";
import useClickOutside from "../../composables/useClickOutside";
import useKeyPressedUntilMouseClick from "../../composables/useKeyPressedUntilMouseClick";
import { getMetaOrCtrlKey } from "../../../util/navigator";

/**
 * Component that handles FileExplorer interactions.
 *
 * NOTE: Do not add store bindings to component to keep it as reusable as possible
 */
export interface Props {
  mode?: "normal" | "mini";
  /**
   * full path of the currently displayed directory. This is used to
   * track when the path has changed and do actions based on that. e.g reset the
   * selection, close menus, etc
   */
  fullPath?: string;
  /**
   * Determines whether the "back" item should be rendered or not
   */
  isRootFolder: boolean;
  /**
   * List of items to be rendered for the displayed directory
   */
  items: Array<FileExplorerItemType>;
  /**
   * This function can let you customize the icons that get rendered for each item
   * displayed in the directory
   */
  itemIconRenderer?: ItemIconRenderer | null;
  /**
   * Used to externally bind which item should be in the "rename" state.
   * This prop is not required but it's useful
   * if you want to externally activate the rename state (e.g via the store)
   */
  activeRenamedItemId?: string | null;
  /**
   * Disable the context menu completely
   */
  disableContextMenu?: boolean;
  /**
   * Disable multi-selection
   */
  disableMultiSelect?: boolean;
  /**
   * Disable dragging completely
   */
  disableDragging?: boolean;
  /**
   * Controls the behavior of the custom drag ghosts as you move items around
   *
   * "auto" -> will automatically remove the ghosts after interactions
   * "manual" -> requires that you call an `onComplete` callback upon
   *
   * `dragend` and/or `drop` events. This is useful for async operations, in which
   * you might not know whether a move was successful or not
   *
   * `disabled` will only use the native browser drag ghost
   *
   * Note: this prop will have no effect if `disableDragging` is true
   */
  draggingAnimationMode?: "auto" | "manual" | "disabled";
  /**
   * Pass in an html elements here which, when clicked, should not unset the current selection.
   */
  clickOutsideException?: HTMLElement | null;
  /**
   * Selected item ids
   */
  selectedItemIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  mode: "normal",
  fullPath: "",
  itemIconRenderer: null,
  activeRenamedItemId: null,
  disableContextMenu: false,
  disableMultiSelect: false,
  disableDragging: false,
  draggingAnimationMode: "auto",
  clickOutsideException: null,
  selectedItemIds: () => [],
});

const emit = defineEmits<{
  /** @deprecated please use update:selectedItemIds */
  (e: "changeSelection", selectedItemIds: Array<string>): void;
  (e: "update:selectedItemIds", selectedItemIds: Array<string>): void;
  (e: "changeDirectory", pathId: string): void;
  (e: "openFile", item: FileExplorerItemType): void;
  (e: "deleteItems", payload: { items: Array<FileExplorerItemType> }): void;
  (
    e: "moveItems",
    payload: {
      sourceItems: Array<string>;
      targetItem: string;
      onComplete: (isSuccessfulMove: boolean) => void;
    },
  ): void;
  (
    e: "dragend",
    payload: {
      event: DragEvent;
      sourceItem: FileExplorerItemType;
      onComplete: (isSuccessfulMove: boolean) => void;
    },
  ): void;
  (e: "drag", payload: { event: DragEvent; item: FileExplorerItemType }): void;
  (e: "renameFile", payload: { itemId: string; newName: string }): void;
}>();

const isDirectory = (item: FileExplorerItemType) => item.isDirectory;

const canOpenFile = (item: FileExplorerItemType) => item.isOpenableFile;

const changeDirectory = (pathId: string) => {
  emit("changeDirectory", pathId);
};

/** Refs */
const itemRefs = ref<{ $el: HTMLElement }[]>([]);
const itemBack = ref<{ $el: HTMLElement } | null>(null);
const table = ref<null | HTMLElement>(null);

/** MULTISELECTION */
const multiSelection = useMultiSelection({
  singleSelectionOnly: toRef(props, "disableMultiSelect"),
  numberOfItems: computed(() => props.items.length),
  startIndex: computed(() => (itemBack.value ? -1 : 0)),
});
const {
  multiSelectionState,
  handleSelectionClick,
  handleKeyboardNavigation,
  isSelected,
  focusedIndex,
  selectedIndexes,
  isMultipleSelectionActive,
  resetSelection,
  ctrlClickItem,
} = multiSelection;

const selectedItems = computed(() =>
  selectedIndexes.value.map((index) => props.items[index]),
);

const getItemElement = (index: number) => {
  return itemRefs.value[index]?.$el;
};

// handle selection of items via prop change
watch(toRef(props, "selectedItemIds"), (itemIds) => {
  // look up item indices
  const itemIndices = itemIds
    .map((id) => props.items.findIndex((item) => item.id === id))
    .filter((index) => index !== -1);

  // all items are already selected
  if (itemIndices.every(isSelected)) {
    return;
  }

  // reset and select all via index
  resetSelection();
  itemIndices.forEach((index) => ctrlClickItem(index));

  // scroll to first selected item
  const firstIndex = itemIndices.slice().sort().at(0) ?? -1; // NOSONAR
  const element = itemRefs.value[firstIndex]?.$el;
  element?.scrollIntoView({ behavior: "smooth", block: "center" });
});

watch(multiSelectionState, () => {
  const itemIds = selectedItems.value.map((item) => item.id);
  emit("changeSelection", itemIds);
  emit("update:selectedItemIds", itemIds);
});
/** MULTISELECTION */

/** RENAME */
const renamedItemId = ref<string | null>(null);
const blacklistedNames = computed(() =>
  props.items
    .filter((item) => item.id !== renamedItemId.value)
    .map(({ name }) => name),
);
const { activeRenamedItemId } = toRefs(props);
watch(activeRenamedItemId, () => {
  renamedItemId.value = props.activeRenamedItemId;
});
/** RENAME */

/** DRAGGING */
const customPreviewContainer = ref<HTMLElement | null>(null);
const customDragPreviewPlaceholder = ref<HTMLElement | null>(null);

const {
  isDragging,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrag,
  onDragLeave,
  onDragEnd,
  onDrop,
} = useItemDragging({
  itemBACK: computed(() => (itemBack.value ? itemBack.value.$el : null)),
  itemRefs: computed(() =>
    itemRefs.value ? itemRefs.value.map(({ $el }) => $el) : null,
  ),
  draggingAnimationMode: toRef(props, "draggingAnimationMode"),
  isDirectory,
  items: toRefs(props).items,
  multiSelection,
  // when default slot element (customDragPreviewPlaceholder ref) is not present, then
  // it means the slot has an element inside, so we should use a custom preview
  shouldUseCustomDragPreview: computed(
    () =>
      !customDragPreviewPlaceholder.value &&
      props.draggingAnimationMode !== "disabled",
  ),
  // we then can obtain the element by using the container
  getCustomPreviewEl: () => document.querySelector(".custom-preview")!,
});

/**
 * This helper simply forwards the emission of the given event name, provided the payload is not null.
 * It's needed because the `useItemDragging` composable doesn't have access to the component emits
 */
const forwardEmit = (
  eventName: "moveItems" | "drag" | "dragend",
  eventPayload: unknown | null,
) => {
  if (eventPayload === null) {
    return;
  }

  // @ts-expect-error
  emit(eventName, eventPayload);
};
/** DRAGGING */

/** KEYBOARD NAV */
const keyPressedUntilMouseClick = useKeyPressedUntilMouseClick([
  "Tab",
  " ",
  "ArrowUp",
  "ArrowDown",
]);

const focusIndex = (index: number, updateState = true) => {
  // focus item back
  if (index === -1) {
    itemBack.value?.$el.focus();
    return;
  }

  // focus item back if its the only thing
  if (props.items.length === 0) {
    itemBack.value?.$el.focus();
  }

  getItemElement(index)?.focus();
  if (updateState) {
    focusedIndex.value = index;
  }
};

const handleFocusOnTable = (event: FocusEvent) => {
  if (table.value?.contains(event.relatedTarget as Node)) {
    return;
  }
  focusIndex(0);
};

watch(focusedIndex, async (index) => {
  // cancel rename on keyboard move
  if (renamedItemId.value) {
    renamedItemId.value = null;
  }
  await nextTick();
  focusIndex(index, false);
});

/** KEYBOARD NAV */

const isContextMenuVisible = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });
const contextMenuAnchor = ref<FileExplorerContextMenuNamespace.Anchor | null>(
  null,
);

const closeContextMenu = () => {
  isContextMenuVisible.value = false;
  contextMenuAnchor.value = null;
  // focus element again where we left of
  getItemElement(focusedIndex.value)?.focus();
};

const { fullPath } = toRefs(props);
watch(fullPath, async () => {
  resetSelection();
  closeContextMenu();
  // call this here on path change to ensure something will be focused
  await nextTick();
  focusIndex(0);
});

const openContextMenu = (
  event: MouseEvent | KeyboardEvent,
  clickedItem: FileExplorerItemType,
  index: number,
) => {
  const element = getItemElement(index);

  if (event instanceof MouseEvent) {
    contextMenuPos.value.x = event.clientX;
    contextMenuPos.value.y = event.clientY;
  } else {
    const rect = element.getBoundingClientRect();
    // eslint-disable-next-line no-magic-numbers
    contextMenuPos.value.x = rect.x + rect.width * 0.8;
    contextMenuPos.value.y = rect.y + rect.height / 2;
  }

  contextMenuAnchor.value = { item: clickedItem, index, element };

  if (!isSelected(index)) {
    handleSelectionClick(index);
  }

  isContextMenuVisible.value = true;
};

const deleteSelectedItems = () => {
  const hasNonDeletableItem = selectedItems.value.some(
    (item) => !item.canBeDeleted,
  );
  if (hasNonDeletableItem) {
    return;
  }
  emit("deleteItems", { items: selectedItems.value });
};

const renameItem = (item: FileExplorerItemType) => {
  // do not rename if multiple items are selected
  if (item.canBeRenamed && selectedIndexes.value.length < 2) {
    renamedItemId.value = item.id;
  }
};

const onContextMenuItemClick = (
  payload: FileExplorerContextMenuNamespace.ItemClickPayload,
) => {
  const { isDelete, isRename, anchorItem } = payload;

  if (isDelete) {
    deleteSelectedItems();
  }

  if (isRename) {
    renameItem(anchorItem);
  }

  resetSelection();
  closeContextMenu();
};

const onItemClick = (
  item: FileExplorerItemType,
  event: MouseEvent,
  index: number,
) => {
  if (renamedItemId.value !== item.id) {
    handleSelectionClick(index, event);
  }

  closeContextMenu();
};

const openFileOrEnterFolder = (item: FileExplorerItemType) => {
  if (isDirectory(item)) {
    changeDirectory(item.id);
    return;
  }

  if (canOpenFile(item)) {
    emit("openFile", item);
  }
};

const handleEnterKey = (event: KeyboardEvent, item: FileExplorerItemType) => {
  const ctrlOrMeta = getMetaOrCtrlKey();
  if (event[ctrlOrMeta]) {
    return;
  }
  openFileOrEnterFolder(item);
};

useClickOutside({
  targets: [table, toRef(props, "clickOutsideException")],
  callback: resetSelection,
});
</script>

<template>
  <table
    ref="table"
    tabindex="0"
    :class="{ 'keyboard-focus': keyPressedUntilMouseClick }"
    aria-label="list of files in the current folder"
    @focus="handleFocusOnTable"
    @keydown="handleKeyboardNavigation"
  >
    <thead>
      <tr>
        <th scope="col">Type</th>
        <th class="name" scope="col">Name</th>
      </tr>
    </thead>
    <tbody :class="mode">
      <FileExplorerItemBack
        v-if="!isRootFolder"
        ref="itemBack"
        tabindex="-1"
        :class="{
          'keyboard-focus': keyPressedUntilMouseClick,
        }"
        :is-dragging="isDragging"
        @dragenter="onDragEnter($event, -1, true)"
        @dragleave="onDragLeave($event, -1, true)"
        @dragover="onDragOver"
        @drop.prevent="forwardEmit('moveItems', onDrop($event, -1, true))"
        @keydown.enter.stop.prevent="changeDirectory('..')"
        @click="changeDirectory('..')"
      />

      <FileExplorerItem
        v-for="(item, index) in items"
        :key="index"
        ref="itemRefs"
        tabindex="-1"
        :class="{
          'keyboard-focus': keyPressedUntilMouseClick,
        }"
        :item="item"
        :title="item.name"
        :is-dragging="isDragging"
        :is-selected="isSelected(index)"
        :is-rename-active="item.id === renamedItemId"
        :blacklisted-names="blacklistedNames"
        :item-icon-renderer="itemIconRenderer"
        :is-dragging-enabled="!disableDragging"
        @dragstart="onDragStart($event, index)"
        @dragenter="onDragEnter($event, index)"
        @dragover="onDragOver"
        @dragleave="onDragLeave($event, index)"
        @dragend="forwardEmit('dragend', onDragEnd($event, item))"
        @drag="forwardEmit('drag', onDrag($event, item))"
        @click="onItemClick(item, $event, index)"
        @contextmenu="openContextMenu($event, item, index)"
        @keydown.shift.f10="openContextMenu($event, item, index)"
        @drop="forwardEmit('moveItems', onDrop($event, index))"
        @dblclick="openFileOrEnterFolder(item)"
        @keydown.delete.stop.prevent="deleteSelectedItems"
        @keydown.f2.stop.prevent="renameItem(item)"
        @keydown.enter.prevent="handleEnterKey($event, item)"
        @rename:submit="emit('renameFile', $event)"
        @rename:clear="renamedItemId = null"
      />

      <tr v-if="items.length === 0" class="empty">
        <td>Folder is empty</td>
      </tr>
    </tbody>

    <div
      v-if="draggingAnimationMode !== 'disabled'"
      ref="customPreviewContainer"
      class="custom-preview"
    >
      <slot name="customDragPreview">
        <div ref="customDragPreviewPlaceholder" />
      </slot>
    </div>

    <FileExplorerContextMenu
      v-if="
        !props.disableContextMenu && isContextMenuVisible && contextMenuAnchor
      "
      :position="contextMenuPos"
      :anchor="contextMenuAnchor"
      :selected-items="selectedItems"
      @item-click="onContextMenuItemClick"
      @close="closeContextMenu"
    >
      <template #default="slotProps">
        <slot
          name="contextMenu"
          :is-context-menu-visible="isContextMenuVisible"
          :position="contextMenuPos"
          :anchor="contextMenuAnchor"
          :close-context-menu="closeContextMenu"
          :is-multiple-selection-active="
            isMultipleSelectionActive(contextMenuAnchor.index)
          "
          v-bind="slotProps"
        />
      </template>
    </FileExplorerContextMenu>
  </table>
</template>

<style lang="postcss" scoped>
@import url("../../css/mixins.css");

thead {
  /* Hide table head for better readability but keeping it for a11y reasons */
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  white-space: nowrap; /* added line */
}

table,
thead,
tbody {
  display: block;
  width: 100%;
  border-spacing: 0;
}

table:focus {
  outline: none;

  &.keyboard-focus {
    @mixin focus-outline;
  }
}

.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--knime-silver-sand);
  height: 76px;
}

tbody:not(.mini) .empty {
  background: var(--knime-gray-ultra-light);
}

.custom-preview {
  position: fixed;
  top: 0;
  left: 0;
  height: 70px;
  width: 70px;
  pointer-events: none;
  z-index: 9;
}
</style>
