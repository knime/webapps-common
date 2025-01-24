import type { Toast } from "../types";
declare const _default: import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Toast>, {
    type: string;
    headline: string;
    message: string;
    component: null;
    autoRemove: boolean;
    active: boolean;
    buttons: () => never[];
    stackId: string;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    remove: (...args: any[]) => void;
    "auto-remove": (...args: any[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Toast>, {
    type: string;
    headline: string;
    message: string;
    component: null;
    autoRemove: boolean;
    active: boolean;
    buttons: () => never[];
    stackId: string;
}>>> & {
    onRemove?: ((...args: any[]) => any) | undefined;
    "onAuto-remove"?: ((...args: any[]) => any) | undefined;
}, {
    type: "error" | "info" | "success" | "warning";
    component: import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }> | null;
    active: boolean;
    headline: string;
    message: string;
    buttons: import("../types").ToastButton[];
    autoRemove: boolean;
    stackId: string;
}, {}>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
