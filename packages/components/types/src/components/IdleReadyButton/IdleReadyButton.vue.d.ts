declare const _default: import("vue").DefineComponent<{
    /**
     * Indicate idle state, e.g. loading
     */
    idle: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Idle text
     */
    idleText: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Should the button be ready
     */
    ready: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Button ready text
     */
    readyText: {
        type: StringConstructor;
        default: string;
    };
    /**
     * `true` to render an arrow icon with the readyText. Defaults to `false`.
     */
    withDownIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * show button with border
     */
    withBorder: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    clientOnlyComponent(): import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any>;
    text(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Indicate idle state, e.g. loading
     */
    idle: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Idle text
     */
    idleText: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Should the button be ready
     */
    ready: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Button ready text
     */
    readyText: {
        type: StringConstructor;
        default: string;
    };
    /**
     * `true` to render an arrow icon with the readyText. Defaults to `false`.
     */
    withDownIcon: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * show button with border
     */
    withBorder: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    withBorder: boolean;
    ready: boolean;
    idle: boolean;
    idleText: string;
    readyText: string;
    withDownIcon: boolean;
}, {}>;
export default _default;
