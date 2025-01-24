declare const _default: import("vue").DefineComponent<{
    /**
     * Array of Ports
     * Port {
     *   color: String, // css-format
     *   optional: Boolean,
     *   type: String, // on of ['flowVariable', 'table', 'other']
     *   typeName: String, // human readable data type,
     *   name: String, // name of this port
     *   description: String
     * }
     */
    ports: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Header title of this PortGroup */
    title: {
        type: StringConstructor;
        default: string;
    };
    groupDescription: {
        type: StringConstructor;
        default: null;
    };
}, any, any, {
    /**
     * Decides whether we are rendering static or dynamic ports.
     * @returns {Boolean} dynamicPorts
     */
    dynamicPorts(): boolean;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Array of Ports
     * Port {
     *   color: String, // css-format
     *   optional: Boolean,
     *   type: String, // on of ['flowVariable', 'table', 'other']
     *   typeName: String, // human readable data type,
     *   name: String, // name of this port
     *   description: String
     * }
     */
    ports: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Header title of this PortGroup */
    title: {
        type: StringConstructor;
        default: string;
    };
    groupDescription: {
        type: StringConstructor;
        default: null;
    };
}>>, {
    title: string;
    ports: unknown[];
    groupDescription: string;
}, {}>;
export default _default;
