import type { AllowedIntervalFormatsType } from "./utils/types";
/**
 * Component used to input a period or duration in ISO format.
 */
declare const _default: import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    modelValue: string;
} & {
    format?: AllowedIntervalFormatsType | undefined;
    allowDescending?: boolean | undefined;
    disabled?: boolean | undefined;
    compact?: boolean | undefined;
}>, {
    format: string;
    allowDescending: boolean;
    disabled: boolean;
    compact: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (modelValue: string) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<{
    modelValue: string;
} & {
    format?: AllowedIntervalFormatsType | undefined;
    allowDescending?: boolean | undefined;
    disabled?: boolean | undefined;
    compact?: boolean | undefined;
}>, {
    format: string;
    allowDescending: boolean;
    disabled: boolean;
    compact: boolean;
}>>> & {
    "onUpdate:modelValue"?: ((modelValue: string) => any) | undefined;
}, {
    compact: boolean;
    disabled: boolean;
    format: AllowedIntervalFormatsType;
    allowDescending: boolean;
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
