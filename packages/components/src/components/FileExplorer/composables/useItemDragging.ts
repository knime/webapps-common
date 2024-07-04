import { computed, ref, watch, type Ref } from "vue";

import type { UseMultiSelectionReturn } from "./useMultiSelection";
import { createDragGhosts } from "../utils/dragGhostHelpers";
import type { FileExplorerItem } from "../types";

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

export const EMPTY_DRAG_IMAGE = new Image(1, 1);
EMPTY_DRAG_IMAGE.src =
  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";

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

    // remove native drag image for custom animation modes
    if (
      EMPTY_DRAG_IMAGE.complete &&
      options.draggingAnimationMode.value !== "disabled"
    ) {
      event.dataTransfer!.dropEffect = "move";
      event.dataTransfer!.effectAllowed = "move";
      event.dataTransfer!.setDragImage(EMPTY_DRAG_IMAGE, 0, 0);
    }

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

  const hasDroppedInside = ref(false);

  const doRemoveGhosts = (animateOut: boolean) => {
    __removeGhosts?.(animateOut);
    __removeGhosts = null;
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

    hasDroppedInside.value = true;

    const onComplete = (isSuccessful: boolean) => {
      if (isSuccessful) {
        multiSelection.resetSelection();
      }

      // animate ghosts back if move was unsuccessful
      doRemoveGhosts(!isSuccessful);
    };

    if (!isGoBackItem && !isDirectory(items.value[index])) {
      doRemoveGhosts(true);
      return null;
    }

    const targetItem = isGoBackItem ? ".." : items.value[index].id;

    const isTargetSelected = selectedItemIds.value.includes(targetItem);

    if (isTargetSelected) {
      doRemoveGhosts(true);
      return null;
    }

    if (options.draggingAnimationMode.value === "auto") {
      onComplete(true);
    }

    return {
      sourceItems: selectedItemIds.value,
      targetItem,
      onComplete,
    };
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
      doRemoveGhosts(true);
      return null;
    }

    if (hasDroppedInside.value) {
      hasDroppedInside.value = false;
      // since hasDroopedInside was true we can ignore removing the ghosts
      // because this was taken care of by the `onDrop` handler
      return null;
    }

    const onComplete = (isSuccessfulDrop: boolean) => {
      if (isSuccessfulDrop) {
        multiSelection.resetSelection();
      }

      // animate ghosts back if drop was unsuccessful
      doRemoveGhosts(!isSuccessfulDrop);
    };

    if (options.draggingAnimationMode.value === "auto") {
      onComplete(true);
    }

    return { event, sourceItem: item, onComplete };
  };

  return {
    isDragging,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDrag,
    onDragLeave,
    onDrop,
    onDragEnd,
  };
};
