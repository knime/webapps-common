declare const _default: import("vue").DefineComponent<{
    /**
     * If set, the button renders an <a> element instead of a <button> element
     * Has no effect when used together with `to`.
     */
    href: {
        type: StringConstructor;
        default: string;
    };
    /**
     * If set, the button renders a <nuxt-link> instead of a <button> element.
     * Supersedes the `href` property.
     */
    to: {
        type: StringConstructor;
        default: string;
    };
    /**
     * toggle to prevent default click handler
     */
    preventDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {
    component(): import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any> | "a" | "button";
    dynamicProps(): {
        to: string;
        event: string | never[];
        href?: undefined;
    } | {
        href: string;
        to?: undefined;
        event?: undefined;
    } | {
        to?: undefined;
        event?: undefined;
        href?: undefined;
    };
}, {
    onClick(e: MouseEvent): void;
    /**
     * This can be called from outside via focus on a $ref
     */
    focus(): void;
    /**
     * This can be called from outside via getComponent on a $ref
     */
    getComponent(): HTMLButtonElement;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "click"[], "click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * If set, the button renders an <a> element instead of a <button> element
     * Has no effect when used together with `to`.
     */
    href: {
        type: StringConstructor;
        default: string;
    };
    /**
     * If set, the button renders a <nuxt-link> instead of a <button> element.
     * Supersedes the `href` property.
     */
    to: {
        type: StringConstructor;
        default: string;
    };
    /**
     * toggle to prevent default click handler
     */
    preventDefault: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onClick?: ((...args: any[]) => any) | undefined;
}, {
    to: string;
    href: string;
    preventDefault: boolean;
    disabled: boolean;
}, {}>;
export default _default;
