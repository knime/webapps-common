declare const _default: import("vue").DefineComponent<{
    /**
     * Array with message configuration objects.
     *
     * @example
     * [{
     *    id
     *    type (see Message component for supported values)
     *    icon (Component)
     *    button (optional button text)
     *    message (actual message String)
     *    content (optional Vue component to render instead of text message, icon, etc.)
     *    link: { (optional link that will be displayed after the message)
     *       text
     *       href (external links, will become <a></a>)
     *       to (internal links, will become <nuxt-link></nuxt-link>)
     *    }
     * }]
     */
    messages: {
        type: ArrayConstructor;
        default: () => never[];
    };
}, any, any, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("dismiss" | "copied")[], "dismiss" | "copied", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Array with message configuration objects.
     *
     * @example
     * [{
     *    id
     *    type (see Message component for supported values)
     *    icon (Component)
     *    button (optional button text)
     *    message (actual message String)
     *    content (optional Vue component to render instead of text message, icon, etc.)
     *    link: { (optional link that will be displayed after the message)
     *       text
     *       href (external links, will become <a></a>)
     *       to (internal links, will become <nuxt-link></nuxt-link>)
     *    }
     * }]
     */
    messages: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>> & {
    onDismiss?: ((...args: any[]) => any) | undefined;
    onCopied?: ((...args: any[]) => any) | undefined;
}, {
    messages: unknown[];
}, {}>;
export default _default;
