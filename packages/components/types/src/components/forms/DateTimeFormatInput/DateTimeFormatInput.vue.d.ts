import { type FormatDateType, type FormatWithExample } from "./utils/types";
/**
 * Component used to input a date/time format like 'YYYY-mm-dd'.
 */
declare const _default: import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    modelValue?: string | undefined;
} & {
    disabled?: boolean | undefined;
    compact?: boolean | undefined;
    isValid?: boolean | undefined;
    allDefaultFormats: FormatWithExample[] | null;
    allowedTypes?: FormatDateType[] | undefined;
}>, {
    disabled: boolean;
    compact: boolean;
    isValid: boolean;
    allowedTypes: () => FormatDateType[];
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (modelValue: string) => void;
    committed: (args_0: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    modelValue?: string | undefined;
} & {
    disabled?: boolean | undefined;
    compact?: boolean | undefined;
    isValid?: boolean | undefined;
    allDefaultFormats: FormatWithExample[] | null;
    allowedTypes?: FormatDateType[] | undefined;
}>, {
    disabled: boolean;
    compact: boolean;
    isValid: boolean;
    allowedTypes: () => FormatDateType[];
}>>> & {
    "onUpdate:modelValue"?: ((modelValue: string) => any) | undefined;
    onCommitted?: ((args_0: string) => any) | undefined;
}, {
    compact: boolean;
    disabled: boolean;
    isValid: boolean;
    allowedTypes: FormatDateType[];
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
