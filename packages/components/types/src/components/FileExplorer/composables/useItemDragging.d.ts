import { type Ref } from "vue";
import type { UseMultiSelectionReturn } from "../../../composables/multiSelection/useMultiSelection";
import type { FileExplorerItem } from "../types";
type UseItemDraggingOptions = {
    items: Ref<Array<FileExplorerItem>>;
    getItemElement: (index: number) => HTMLElement | null;
    itemBACK: Ref<HTMLElement | null>;
    multiSelection: UseMultiSelectionReturn;
    shouldUseCustomDragPreview: Ref<boolean>;
    draggingAnimationMode: Ref<"auto" | "manual" | "disabled">;
    getCustomPreviewEl: () => HTMLElement;
    isDirectory: (item: FileExplorerItem) => boolean;
};
export declare const EMPTY_DRAG_IMAGE: HTMLImageElement | null;
export declare const useItemDragging: (options: UseItemDraggingOptions) => {
    isDragging: Ref<boolean>;
    onDragStart: (event: DragEvent, index: number) => void;
    onDragEnter: (event: DragEvent, index: number, isGoBackItem?: boolean) => void;
    onDragOver: (event: DragEvent) => void;
    onDrag: (event: DragEvent, item: FileExplorerItem) => {
        event: DragEvent;
        item: FileExplorerItem;
    };
    onDragLeave: (event: DragEvent, index: number, isGoBackItem?: boolean) => void;
    onDrop: (event: DragEvent, index: number, isGoBackItem?: boolean) => {
        sourceItems: Array<string>;
        targetItem: string;
        onComplete: (isSuccess: boolean) => void;
    } | null;
    onDragEnd: (event: DragEvent, item: FileExplorerItem) => {
        event: DragEvent;
        sourceItem: FileExplorerItem;
        onComplete: (isSuccess: boolean) => void;
    } | null;
};
export {};
