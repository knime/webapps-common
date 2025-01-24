declare const _default: import("vue").DefineComponent<{
    /**
     * Packages provided for display. They will be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     */
    packages: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Additional packages may be provided for display. The packages (provided in an array)
     * will be combined with the packages imported from the `packages` prop. They will
     * be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     * Additionally, packages can have a `repository` property with a URL to their source.
     */
    additionalPackages: {
        type: ArrayConstructor;
        default: () => never[];
    };
}, any, {
    title: string;
}, {
    displayPackages(): any[];
}, {
    toggleDetails(e: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Packages provided for display. They will be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     */
    packages: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Additional packages may be provided for display. The packages (provided in an array)
     * will be combined with the packages imported from the `packages` prop. They will
     * be sorted and de-duplicated before being displayed.
     *
     * The packages should be the correct format when provided as a prop. For information
     * @see file:@knime/licenses/config/collect-packages-format.json
     *
     * Additionally, packages can have a `repository` property with a URL to their source.
     */
    additionalPackages: {
        type: ArrayConstructor;
        default: () => never[];
    };
}>>, {
    packages: unknown[];
    additionalPackages: unknown[];
}, {}>;
export default _default;
