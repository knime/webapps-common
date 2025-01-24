export type DropzoneProps = {
    labelText?: string;
    accept?: string[];
    multiple?: boolean;
    layout?: "vertical" | "horizontal";
    empty?: boolean;
    error?: boolean;
    disabled?: boolean;
};
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<DropzoneProps>, {
    labelText: string;
    accept: () => never[];
    multiple: boolean;
    layout: string;
    empty: boolean;
    error: boolean;
    disabled: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "files-selected": (files: File[]) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<DropzoneProps>, {
    labelText: string;
    accept: () => never[];
    multiple: boolean;
    layout: string;
    empty: boolean;
    error: boolean;
    disabled: boolean;
}>>> & {
    "onFiles-selected"?: ((files: File[]) => any) | undefined;
}, {
    error: boolean;
    disabled: boolean;
    layout: "horizontal" | "vertical";
    multiple: boolean;
    accept: string[];
    empty: boolean;
    labelText: string;
}, {}>, {
    default?(_: {}): any;
    icon?(_: {}): any;
    button?(_: {}): any;
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
