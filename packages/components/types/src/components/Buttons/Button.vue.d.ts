declare const _default: import("vue").DefineComponent<{
    /**
     * @see {@link BaseButton.vue}
     */
    /**
     * show button with border
     */
    withBorder: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * switches colors to use button on a dark background
     */
    onDark: {
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
    /**
     * smaller font size and padding
     */
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * show button in an error state
     * - requires withBorder
     * - doesnt work onDark
     */
    withWarning: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {
    classes(): (string | {
        primary: boolean;
        "with-border"?: undefined;
        "with-warning"?: undefined;
        "on-dark"?: undefined;
        compact?: undefined;
    } | {
        "with-border": boolean;
        primary?: undefined;
        "with-warning"?: undefined;
        "on-dark"?: undefined;
        compact?: undefined;
    } | {
        "with-warning": boolean;
        primary?: undefined;
        "with-border"?: undefined;
        "on-dark"?: undefined;
        compact?: undefined;
    } | {
        "on-dark": boolean;
        primary?: undefined;
        "with-border"?: undefined;
        "with-warning"?: undefined;
        compact?: undefined;
    } | {
        compact: boolean;
        primary?: undefined;
        "with-border"?: undefined;
        "with-warning"?: undefined;
        "on-dark"?: undefined;
    })[];
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * @see {@link BaseButton.vue}
     */
    /**
     * show button with border
     */
    withBorder: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * switches colors to use button on a dark background
     */
    onDark: {
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
    /**
     * smaller font size and padding
     */
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * show button in an error state
     * - requires withBorder
     * - doesnt work onDark
     */
    withWarning: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    withBorder: boolean;
    compact: boolean;
    disabled: boolean;
    onDark: boolean;
    primary: boolean;
    withWarning: boolean;
}, {}>;
export default _default;
