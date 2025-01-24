import type { FileExplorerItem } from "../types";
interface Props {
    blacklistedNames: Array<string>;
    item: FileExplorerItem;
    isSelected: boolean;
    isDragging: boolean;
    isRenameActive: boolean;
    isDraggingEnabled?: boolean;
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    isDraggingEnabled: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    dblclick: (nativeEvent: MouseEvent) => void;
    click: (nativeEvent: MouseEvent) => void;
    dragstart: (nativeEvent: DragEvent) => void;
    dragenter: (nativeEvent: DragEvent) => void;
    dragover: (nativeEvent: DragEvent) => void;
    drag: (nativeEvent: DragEvent) => void;
    dragleave: (nativeEvent: DragEvent) => void;
    dragend: (nativeEvent: DragEvent) => void;
    drop: (nativeEvent: DragEvent) => void;
    contextmenu: (nativeEvent: MouseEvent) => void;
    "rename:submit": (payload: {
        itemId: string;
        newName: string;
    }) => void;
    "rename:clear": () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    isDraggingEnabled: boolean;
}>>> & {
    onDrag?: ((nativeEvent: DragEvent) => any) | undefined;
    onDragend?: ((nativeEvent: DragEvent) => any) | undefined;
    onDragenter?: ((nativeEvent: DragEvent) => any) | undefined;
    onDragleave?: ((nativeEvent: DragEvent) => any) | undefined;
    onDragover?: ((nativeEvent: DragEvent) => any) | undefined;
    onDragstart?: ((nativeEvent: DragEvent) => any) | undefined;
    onDrop?: ((nativeEvent: DragEvent) => any) | undefined;
    onClick?: ((nativeEvent: MouseEvent) => any) | undefined;
    onContextmenu?: ((nativeEvent: MouseEvent) => any) | undefined;
    onDblclick?: ((nativeEvent: MouseEvent) => any) | undefined;
    "onRename:submit"?: ((payload: {
        itemId: string;
        newName: string;
    }) => any) | undefined;
    "onRename:clear"?: (() => any) | undefined;
}, {
    isDraggingEnabled: boolean;
}, {}>, {
    icon?(_: {}): any;
    default?(_: {
        isRenameActive: boolean;
        isSelected: boolean;
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
