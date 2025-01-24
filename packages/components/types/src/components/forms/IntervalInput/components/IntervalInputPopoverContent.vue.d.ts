import type { AllowedIntervalFormatsType, IntervalDirectionalityType, PopoverModelType, UsedIntervalFormatsType } from "../utils/types";
declare let __VLS_typeProps: {
    format: AllowedIntervalFormatsType;
    allowDescending: boolean;
};
type __VLS_PublicProps = {
    "usedFormat": UsedIntervalFormatsType;
    modelValue: PopoverModelType;
} & typeof __VLS_typeProps;
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToOption<__VLS_PublicProps>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (modelValue: PopoverModelType) => void;
    "update:usedFormat": (usedFormat: UsedIntervalFormatsType) => void;
    commit: (usedFormat: UsedIntervalFormatsType, popoverValues: PopoverModelType, directionality: IntervalDirectionalityType) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<__VLS_PublicProps>>> & {
    "onUpdate:modelValue"?: ((modelValue: PopoverModelType) => any) | undefined;
    onCommit?: ((usedFormat: UsedIntervalFormatsType, popoverValues: PopoverModelType, directionality: IntervalDirectionalityType) => any) | undefined;
    "onUpdate:usedFormat"?: ((usedFormat: UsedIntervalFormatsType) => any) | undefined;
}, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
