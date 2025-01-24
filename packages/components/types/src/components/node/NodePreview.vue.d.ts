declare const _default: import("vue").DefineComponent<{
    /**
     * Type of node; determines the background color.
     * @example 'Reader'
     */
    type: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Use alternative rendering style:
     * Components always have a gray background and a smaller rectangle whose background indicates the node type
     */
    isComponent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * List of incoming ports
     * Port: {
     *    color: String (css-compatible),
     *    optional: Boolean,
     *    type: String,
     *    ...
     * }
     *
     * The port format is further described in
     * https://bitbucket.org/KNIME/knime-com-shared/src/master/com.knime.gateway.codegen/src-gen/api/web-ui/gateway.yaml#lines-545
     */
    inPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * List ouf outgoing ports
     */
    outPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Show three dots to indicate dynamic ports
     */
    hasDynPorts: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * URL of icon that is rendered inside the node. (Possibly `data:` URL)
     * Passed through to NodeTorsoNormal
     */
    icon: {
        type: StringConstructor;
        default: null;
        validator: (url: unknown) => any;
    };
}, any, {
    viewBox: string;
}, {}, {
    yPortShift(index: any, total: any): number;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Type of node; determines the background color.
     * @example 'Reader'
     */
    type: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Use alternative rendering style:
     * Components always have a gray background and a smaller rectangle whose background indicates the node type
     */
    isComponent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * List of incoming ports
     * Port: {
     *    color: String (css-compatible),
     *    optional: Boolean,
     *    type: String,
     *    ...
     * }
     *
     * The port format is further described in
     * https://bitbucket.org/KNIME/knime-com-shared/src/master/com.knime.gateway.codegen/src-gen/api/web-ui/gateway.yaml#lines-545
     */
    inPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * List ouf outgoing ports
     */
    outPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /**
     * Show three dots to indicate dynamic ports
     */
    hasDynPorts: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * URL of icon that is rendered inside the node. (Possibly `data:` URL)
     * Passed through to NodeTorsoNormal
     */
    icon: {
        type: StringConstructor;
        default: null;
        validator: (url: unknown) => any;
    };
}>>, {
    type: string;
    icon: string;
    inPorts: unknown[];
    outPorts: unknown[];
    isComponent: boolean;
    hasDynPorts: boolean;
}, {}>;
export default _default;
