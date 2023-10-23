import { computed, ref, watch, type Ref } from "vue";

import type { UseMultiSelectionReturn } from "./useMultiSelection";
import { createDragGhosts } from "./dragGhostHelpers";
import type { FileExplorerItem } from "./types";

type UseItemDraggingOptions = {
  items: Ref<Array<FileExplorerItem>>;
  itemRefs: Ref<HTMLElement[] | null>;
  itemBACK: Ref<HTMLElement | null>;
  multiSelection: UseMultiSelectionReturn;
  shouldUseCustomDragPreview: Ref<boolean>;
  draggingAnimationMode: Ref<"auto" | "manual" | "disabled">;
  getCustomPreviewEl: () => HTMLElement;
  isDirectory: (item: FileExplorerItem) => boolean;
};

let __removeGhosts: ReturnType<typeof createDragGhosts>["removeGhosts"] | null =
  null;

let __replaceGhostPreview:
  | ReturnType<typeof createDragGhosts>["replaceGhostPreview"]
  | null = null;

export const useItemDragging = (options: UseItemDraggingOptions) => {
  const {
    items,
    itemBACK,
    itemRefs,
    shouldUseCustomDragPreview,
    getCustomPreviewEl,
    multiSelection,
    isDirectory,
  } = options;

  const isDragging = ref(false);
  const startDragItemIndex = ref<number | null>(null);

  const selectedItems = computed(() =>
    multiSelection.selectedIndexes.value.map((index) => items.value[index]),
  );
  const selectedItemIds = computed(() =>
    selectedItems.value.map((item) => item.id),
  );

  const getItemElementByRefIndex = (
    index: number,
    isGoBackItem = false,
  ): HTMLElement =>
    isGoBackItem
      ? itemBACK.value!
      : // except for the "Go back" item, all others are present within a v-for
        // so the refs are returned in a collection
        itemRefs.value![index];

  const onDragStart = (event: DragEvent, index: number) => {
    isDragging.value = true;
    startDragItemIndex.value = index;

    if (!multiSelection.isSelected(index)) {
      multiSelection.resetSelection();
      multiSelection.handleSelectionClick(index);
    }

    if (options.draggingAnimationMode.value === "disabled") {
      return;
    }

    // get all items that are selected, except the one that initiated the drag
    const otherSelectedIndexes = multiSelection.selectedIndexes.value.filter(
      (selectedIndex) => index !== selectedIndex,
    );

    // map an index to an object that will be used to generate the ghost
    const toGhostTarget = (_index: number) => ({
      targetEl: getItemElementByRefIndex(_index),
      textContent: items.value[_index].name,
    });

    const selectedTargets = ([] as Array<ReturnType<typeof toGhostTarget>>)
      // add the item that initiated the drag at the beginning of the array
      .concat(toGhostTarget(index))
      .concat(otherSelectedIndexes.map(toGhostTarget));

    const dragGhostHelpers = createDragGhosts({
      dragStartEvent: event,
      badgeCount: multiSelection.isMultipleSelectionActive(index)
        ? otherSelectedIndexes.length + 1
        : null,
      selectedTargets,
    });

    __removeGhosts = dragGhostHelpers.removeGhosts;
    __replaceGhostPreview = dragGhostHelpers.replaceGhostPreview;
  };

  const onDragEnter = (
    event: DragEvent,
    index: number,
    isGoBackItem = false,
  ) => {
    if (!isDragging.value) {
      return;
    }

    if (multiSelection.isSelected(index) && !isGoBackItem) {
      return;
    }

    if (index !== startDragItemIndex.value) {
      const draggedOverEl = getItemElementByRefIndex(index, isGoBackItem);
      draggedOverEl.classList.add("dragging-over");
    }
  };

  const onDragOver = (event: DragEvent) => {
    if (isDragging.value) {
      event.preventDefault();
    }
  };

  const onDrag = (
    event: DragEvent,
    item: FileExplorerItem,
  ): { event: DragEvent; item: FileExplorerItem } => ({ event, item });

  watch(options.draggingAnimationMode, (next, prev) => {
    if (next !== prev && prev === "disabled") {
      __removeGhosts?.();
    }
  });

  watch(shouldUseCustomDragPreview, () => {
    if (isDragging.value) {
      __replaceGhostPreview?.({
        shouldUseCustomPreview: shouldUseCustomDragPreview.value,
        ghostPreviewEl: getCustomPreviewEl(),
        opts: { leftOffset: 35, topOffset: 35 },
      });
    }
  });

  const onDragLeave = (
    event: DragEvent,
    index: number,
    isGoBackItem = false,
  ) => {
    const draggedOverEl = getItemElementByRefIndex(index, isGoBackItem);
    draggedOverEl.classList.remove("dragging-over");
  };

  type DragEndReturn = {
    event: DragEvent;
    sourceItem: FileExplorerItem;
    onComplete: (isSuccess: boolean) => void;
  } | null;

  const onDragEnd = (
    event: DragEvent,
    item: FileExplorerItem,
  ): DragEndReturn => {
    isDragging.value = false;

    if (event.dataTransfer?.dropEffect === "none") {
      __removeGhosts?.();
      return null;
    }

    const onComplete = (isSuccessfulDrop: boolean) => {
      if (isSuccessfulDrop) {
        multiSelection.resetSelection();
      }

      // animate ghosts back if drop was unsuccessful
      __removeGhosts?.(!isSuccessfulDrop);
    };

    if (options.draggingAnimationMode.value === "auto") {
      onComplete(true);
    }

    return { event, sourceItem: item, onComplete };
  };

  type DropReturn = {
    sourceItems: Array<string>;
    targetItem: string;
    onComplete: (isSuccess: boolean) => void;
  } | null;

  const onDrop = (
    event: DragEvent,
    index: number,
    isGoBackItem = false,
  ): DropReturn => {
    const droppedEl = getItemElementByRefIndex(index, isGoBackItem);
    droppedEl.classList.remove("dragging-over");

    if (!isGoBackItem && !isDirectory(items.value[index])) {
      return null;
    }

    const targetItem = isGoBackItem ? ".." : items.value[index].id;

    const isTargetSelected = selectedItemIds.value.includes(targetItem);

    if (isTargetSelected) {
      return null;
    }

    const onComplete = (isSuccessfulMove: boolean) => {
      if (isSuccessfulMove) {
        multiSelection.resetSelection();
      }

      // animate ghosts back if move was unsuccessful
      __removeGhosts?.(!isSuccessfulMove);
      __removeGhosts = null;
    };

    if (options.draggingAnimationMode.value === "auto") {
      onComplete(true);
    }

    return {
      sourceItems: selectedItemIds.value,
      targetItem,
      onComplete,
    };
  };

  return {
    isDragging,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDrag,
    onDragLeave,
    onDragEnd,
    onDrop,
  };
};
