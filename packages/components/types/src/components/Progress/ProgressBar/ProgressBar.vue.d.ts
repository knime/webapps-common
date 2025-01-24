type Props = {
    /**
     * The percentage of progress to display.
     * If the value is less than 1, it will be displayed as 1%. If the value
     * is greater than 100, it will be capped at 100%. Defaults to 0.
     */
    percentage?: number;
    /**
     * Whether to display an indeterminate loading
     * state instead of a specific percentage. Defaults to false.
     */
    indeterminate?: boolean;
    /**
     * Whether to show the progress bar in a compact
     * mode. Defaults to false.
     */
    compact?: boolean;
    /**
     * Custom tooltip could be provided
     */
    toolTip?: string;
};
declare const _default: import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    percentage: number;
    indeterminate: boolean;
    compact: boolean;
    toolTip: string;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    percentage: number;
    indeterminate: boolean;
    compact: boolean;
    toolTip: string;
}>>>, {
    compact: boolean;
    indeterminate: boolean;
    percentage: number;
    toolTip: string;
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
