import type { FileExplorerContextMenu as FileExplorerContextMenuNamespace, FileExplorerItem as FileExplorerItemType } from "../types";
/**
 * Component that handles FileExplorer interactions.
 *
 * NOTE: Do not add store bindings to component to keep it as reusable as possible
 */
interface Props {
    mode?: "normal" | "mini";
    /**
     * full path of the currently displayed directory. This is used to
     * track when the path has changed and do actions based on that. e.g reset the
     * selection, close menus, etc
     */
    fullPath?: string;
    /**
     * List of items to be rendered for the displayed directory
     */
    items: Array<FileExplorerItemType>;
    /**
     * Enables or disables virtual item scrolling for the component.
     * When enabled, only the visible items are rendered, improving performance
     * for large lists by reducing the number of DOM elements. Default: `false`
     */
    virtual?: boolean;
    /**
     * Determines whether the "back" item should be rendered or not
     */
    isRootFolder?: boolean;
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
     * Disables selection completely. (Regardless of the value of the disableMultiSelect prop)
     */
    disableSelection?: boolean;
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
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    mode: string;
    fullPath: string;
    isRootFolder: boolean;
    activeRenamedItemId: null;
    disableContextMenu: boolean;
    disableMultiSelect: boolean;
    disableSelection: boolean;
    disableDragging: boolean;
    draggingAnimationMode: string;
    clickOutsideException: null;
    selectedItemIds: () => never[];
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:selectedItemIds": (selectedItemIds: string[]) => void;
    changeDirectory: (pathId: string) => void;
    openFile: (item: FileExplorerItemType) => void;
    deleteItems: (payload: {
        items: FileExplorerItemType[];
    }) => void;
    moveItems: (payload: {
        sourceItems: string[];
        targetItem: string;
        onComplete: (isSuccessfulMove: boolean) => void;
    }) => void;
    dragend: (payload: {
        event: DragEvent;
        sourceItem: FileExplorerItemType;
        onComplete: (isSuccessfulMove: boolean) => void;
    }) => void;
    drag: (payload: {
        event: DragEvent;
        item: FileExplorerItemType;
    }) => void;
    renameFile: (payload: {
        itemId: string;
        newName: string;
    }) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    mode: string;
    fullPath: string;
    isRootFolder: boolean;
    activeRenamedItemId: null;
    disableContextMenu: boolean;
    disableMultiSelect: boolean;
    disableSelection: boolean;
    disableDragging: boolean;
    draggingAnimationMode: string;
    clickOutsideException: null;
    selectedItemIds: () => never[];
}>>> & {
    onDrag?: ((payload: {
        event: DragEvent;
        item: FileExplorerItemType;
    }) => any) | undefined;
    onDragend?: ((payload: {
        event: DragEvent;
        sourceItem: FileExplorerItemType;
        onComplete: (isSuccessfulMove: boolean) => void;
    }) => any) | undefined;
    onMoveItems?: ((payload: {
        sourceItems: string[];
        targetItem: string;
        onComplete: (isSuccessfulMove: boolean) => void;
    }) => any) | undefined;
    "onUpdate:selectedItemIds"?: ((selectedItemIds: string[]) => any) | undefined;
    onChangeDirectory?: ((pathId: string) => any) | undefined;
    onOpenFile?: ((item: FileExplorerItemType) => any) | undefined;
    onDeleteItems?: ((payload: {
        items: FileExplorerItemType[];
    }) => any) | undefined;
    onRenameFile?: ((payload: {
        itemId: string;
        newName: string;
    }) => any) | undefined;
}, {
    mode: "normal" | "mini";
    fullPath: string;
    isRootFolder: boolean;
    activeRenamedItemId: string | null;
    disableContextMenu: boolean;
    disableMultiSelect: boolean;
    disableSelection: boolean;
    disableDragging: boolean;
    draggingAnimationMode: "auto" | "disabled" | "manual";
    clickOutsideException: HTMLElement | null;
    selectedItemIds: string[];
}, {}>, {
    itemIcon?(_: {
        item: FileExplorerItemType;
    }): any;
    itemContent?(_: {
        item: FileExplorerItemType;
        isRenameActive: boolean;
        isSelected: boolean;
    }): any;
    emptyFolder?(_: {}): any;
    customDragPreview?(_: {}): any;
    contextMenu?(_: {
        items: FileExplorerContextMenuNamespace.MenuItem[];
        createRenameOption: FileExplorerContextMenuNamespace.CreateDefaultMenuOption;
        createDeleteOption: FileExplorerContextMenuNamespace.CreateDefaultMenuOption;
        onItemClick: (menuItem: import("../../types").MenuItem<any, any>) => void;
        isContextMenuVisible: true;
        position: {
            x: number;
            y: number;
        };
        anchor: {
            item: {
                id: string;
                name: string;
                isOpen: boolean;
                isDirectory: boolean;
                isOpenableFile: boolean;
                canBeRenamed: boolean;
                canBeDeleted: boolean;
                meta?: Record<string, any> | undefined;
            };
            index: number;
            element: HTMLElement;
        };
        closeContextMenu: () => void;
        isMultipleSelectionActive: boolean;
    }): any;
}>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
