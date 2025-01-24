interface Props {
    /**
     * Maximum number of tags to display initially.
     * If more tags are present, they will be expandable via a '+' button.
     */
    numberOfInitialTags?: number;
    /**
     * List of tags (Strings) to display.
     * @type Array<String>
     */
    tags?: string[];
    /**
     * List of active tags (Strings) to display.
     * @type Array<String>
     */
    activeTags?: string[];
    /**
     * If the tags should emit events and have hover + cursor styles.
     */
    clickable?: boolean;
    /**
     * Show all tags optional v-model
     */
    showAll?: boolean;
    /**
     * Shows active tags in front of all others
     */
    sortByActive?: boolean;
}
declare const _default: __VLS_WithTemplateSlots<import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    numberOfInitialTags: number;
    tags: () => never[];
    activeTags: () => never[];
    clickable: boolean;
    showAll: boolean;
    sortByActive: boolean;
}>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    click: (tag: string) => void;
    "update:showAll": (showAll: boolean) => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    numberOfInitialTags: number;
    tags: () => never[];
    activeTags: () => never[];
    clickable: boolean;
    showAll: boolean;
    sortByActive: boolean;
}>>> & {
    onClick?: ((tag: string) => any) | undefined;
    "onUpdate:showAll"?: ((showAll: boolean) => any) | undefined;
}, {
    clickable: boolean;
    numberOfInitialTags: number;
    tags: string[];
    activeTags: string[];
    showAll: boolean;
    sortByActive: boolean;
}, {}>, {
    icon?(_: {}): any;
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
