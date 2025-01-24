declare const _default: import("vue").DefineComponent<{
    /**
     * @see {@link BaseButton.vue}
     */
    /**
     * Switches the active style of the component
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * switches colors
     */
    primary: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    single(): any;
}, {
    /**
     * This can be called from outside via focus on a $ref
     */
    focus(): void;
    /**
     * This can be called from outside via getComponent on a $ref
     */
    getComponent(): any;
    hasSingleChildren(slotElement: any): any;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * @see {@link BaseButton.vue}
     */
    /**
     * Switches the active style of the component
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * switches colors
     */
    primary: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    compact: boolean;
    disabled: boolean;
    primary: boolean;
    active: boolean;
}, {}>;
export default _default;
