<script setup lang="ts">
import { ref, toRefs, toRef, computed, watch } from "vue";
import { directive as vClickAway } from "vue3-click-away";

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
   * if you want to extenally activate the rename state (e.g via the store)
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
});

const emit = defineEmits<{
  (e: "changeSelection", selectedItemIds: Array<string>): void;
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

const changeDirectory = (pathId: string) => emit("changeDirectory", pathId);

/** MULTISELECTION */
const multiSelection = useMultiSelection({
  singleSelectionOnly: toRef(props, "disableMultiSelect"),
});
const {
  multiSelectionState,
  handleSelectionClick,
  isSelected,
  selectedIndexes,
  isMultipleSelectionActive,
  resetSelection,
} = multiSelection;

const selectedItems = computed(() =>
  selectedIndexes.value.map((index) => props.items[index]),
);
const selectedItemIds = computed(() =>
  selectedItems.value.map((item) => item.id),
);

watch(multiSelectionState, () => {
  emit("changeSelection", selectedItemIds.value);
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
const itemBack = ref<{ $el: HTMLElement } | null>(null);
const itemRefs = ref<{ $el: HTMLElement }[]>([]);
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

const isContextMenuVisible = ref(false);
const contextMenuPos = ref({ x: 0, y: 0 });
const contextMenuAnchor = ref<FileExplorerContextMenuNamespace.Anchor | null>(
  null,
);

const closeContextMenu = () => {
  isContextMenuVisible.value = false;
  contextMenuAnchor.value = null;
};

const { fullPath } = toRefs(props);
watch(fullPath, () => {
  resetSelection();
  closeContextMenu();
});

const openContextMenu = (
  event: MouseEvent,
  clickedItem: FileExplorerItemType,
  index: number,
) => {
  const element = itemRefs.value[index].$el;
  contextMenuPos.value.x = event.clientX;
  contextMenuPos.value.y = event.clientY;
  contextMenuAnchor.value = { item: clickedItem, index, element };

  if (!isSelected(index)) {
    handleSelectionClick(index);
  }

  isContextMenuVisible.value = true;
};

const onContextMenuItemClick = (
  payload: FileExplorerContextMenuNamespace.ItemClickPayload,
) => {
  const { isDelete, isRename, anchorItem } = payload;

  if (isDelete) {
    emit("deleteItems", { items: selectedItems.value });
  }

  if (isRename) {
    renamedItemId.value = anchorItem.id;
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

const onItemDoubleClick = (item: FileExplorerItemType) => {
  if (isDirectory(item)) {
    changeDirectory(item.id);
    return;
  }

  if (canOpenFile(item)) {
    emit("openFile", item);
  }
};
</script>

<template>
  <table
    v-click-away="() => resetSelection()"
    aria-label="Current workflow group in Space Explorer"
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
        :is-dragging="isDragging"
        @dragenter="onDragEnter($event, -1, true)"
        @dragleave="onDragLeave($event, -1, true)"
        @dragover="onDragOver"
        @drop.prevent="forwardEmit('moveItems', onDrop($event, -1, true))"
        @click="changeDirectory('..')"
      />

      <FileExplorerItem
        v-for="(item, index) in items"
        :key="index"
        ref="itemRefs"
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
        @drop="forwardEmit('moveItems', onDrop($event, index))"
        @dblclick="onItemDoubleClick(item)"
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
