type Props = {
    /**
     * Width in px or %. Defaults to 100%
     */
    width?: `${number}px` | `${number}%`;
    /**
     * Height in px or %. Defaults to 100%
     */
    height?: `${number}px` | `${number}%`;
    /**
     * First color of the animation gradient. Defaults to GrayUltraLight
     */
    color1?: string;
    /**
     * Second color of the animation gradient. Defaults to Porcelain
     */
    color2?: string;
    /**
     * How to render the Skeleton. Defaults to `generic`
     * - generic: box with square borders
     * - buton: button/pill shaped skeleton
     * - icon-button: a circle skeleton
     * - rounded-sm: a box with a small border radius (4px)
     * - rounded-md: a box with a medium border radius (8px)
     */
    variant?: "generic" | "button" | "icon-button" | "rounded-sm" | "rounded-md";
    /**
     * Loading property. When true the skeleton is rendered, otherwise the content
     * of the default slot will be rendered instead
     */
    loading?: boolean;
    /**
     * Whether to repeat this skeleton N times. Defaults to 1
     */
    repeat?: number;
    /**
     * When `repeat` is set, this will be added as spacing in-between items. Defaults to 2px
     */
    repeatGap?: `${number}px`;
};
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    width: string;
    height: string;
    color1: string;
    color2: string;
    variant: string;
    repeat: number;
    loading: boolean;
    repeatGap: string;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    width: string;
    height: string;
    color1: string;
    color2: string;
    variant: string;
    repeat: number;
    loading: boolean;
    repeatGap: string;
}>>>, {
    repeat: number;
    height: `${number}px` | `${number}%`;
    width: `${number}px` | `${number}%`;
    variant: "button" | "generic" | "icon-button" | "rounded-sm" | "rounded-md";
    color1: string;
    color2: string;
    loading: boolean;
    repeatGap: `${number}px`;
}, {}>, {
    default?(_: {
        [x: string]: unknown;
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
