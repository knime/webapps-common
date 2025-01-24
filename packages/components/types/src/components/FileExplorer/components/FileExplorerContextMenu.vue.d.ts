import type { MenuItem as BaseMenuItem } from "../../types";
import type { FileExplorerContextMenu, FileExplorerItem } from "../types";
interface Props {
    position: {
        x: number;
        y: number;
    };
    anchor: FileExplorerContextMenu.Anchor;
    selectedItems: Array<FileExplorerItem>;
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_TypePropsToOption<Props>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    itemClick: (payload: FileExplorerContextMenu.ItemClickPayload) => void;
    close: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<Props>>> & {
    onClose?: (() => any) | undefined;
    onItemClick?: ((payload: FileExplorerContextMenu.ItemClickPayload) => any) | undefined;
}, {}, {}>, {
    default?(_: {
        items: FileExplorerContextMenu.MenuItem[];
        createRenameOption: FileExplorerContextMenu.CreateDefaultMenuOption;
        createDeleteOption: FileExplorerContextMenu.CreateDefaultMenuOption;
        onItemClick: (menuItem: BaseMenuItem<any, any>) => void;
    }): any;
}>;
export default _default;
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
