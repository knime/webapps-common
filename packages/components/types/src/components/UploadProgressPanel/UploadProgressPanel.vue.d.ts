import type { UploadItem } from "./types";
type Props = {
    /**
     * List of items that the upload is comprised of
     */
    items: UploadItem[];
    /**
     * Whether each individual upload item can cancel the upload
     */
    allowCancel?: boolean;
    /**
     * Whether items can be removed individually after they've completed (or failed)
     * each upload
     */
    allowRemove?: boolean;
    /**
     * Indicates the number of items to show as placeholder skeletons
     */
    placeholderItems?: number;
};
declare let __VLS_typeProps: Props;
type __VLS_PublicProps = {
    "expanded"?: boolean;
} & typeof __VLS_typeProps;
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_PublicProps>, {
    allowRemove: boolean;
    allowCancel: boolean;
    placeholderItems: number;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:expanded": (expanded: boolean) => void;
    cancel: (item: UploadItem) => void;
    close: () => void;
    remove: (item: UploadItem) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<__VLS_PublicProps>, {
    allowRemove: boolean;
    allowCancel: boolean;
    placeholderItems: number;
}>>> & {
    onCancel?: ((item: UploadItem) => any) | undefined;
    onClose?: (() => any) | undefined;
    onRemove?: ((item: UploadItem) => any) | undefined;
    "onUpdate:expanded"?: ((expanded: boolean) => any) | undefined;
}, {
    allowCancel: boolean;
    allowRemove: boolean;
    placeholderItems: number;
}, {}>, {
    "extra-actions"?(_: {}): any;
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
