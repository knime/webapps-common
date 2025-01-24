declare const _default: import("vue").DefineComponent<{
    /**
     * Link configuration object. Can either be a nuxt-link (with the `to` property) or an
     * `<a... />` tag (with href).
     *
     * @example
     *    {
     *       text
     *       href (external links, will become <a></a>)
     *       to (internal links, will become <nuxt-link></nuxt-link>)
     *       newTab (will set the 'target' attribute to '_blank' to open link in new tab)
     *    }
     *
     */
    link: {
        type: ObjectConstructor;
        default: () => {};
    };
}, any, any, {
    linkComponent(): import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any>;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Link configuration object. Can either be a nuxt-link (with the `to` property) or an
     * `<a... />` tag (with href).
     *
     * @example
     *    {
     *       text
     *       href (external links, will become <a></a>)
     *       to (internal links, will become <nuxt-link></nuxt-link>)
     *       newTab (will set the 'target' attribute to '_blank' to open link in new tab)
     *    }
     *
     */
    link: {
        type: ObjectConstructor;
        default: () => {};
    };
}>>, {
    link: Record<string, any>;
}, {}>;
export default _default;
