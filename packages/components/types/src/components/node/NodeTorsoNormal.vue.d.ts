export const componentBackgroundPortion: 0.75;
declare const _default: import("vue").DefineComponent<{
    /**
     * Node type, e.g. "Learner", "Visualizer"
     * as defined in org.knime.core.node.NodeFactory.NodeType.
     * Is undefined for MetaNodes
     */
    type: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Differentiate between a native node and a component node
     */
    isComponent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * data-url containing Base64-encoded icon
     */
    icon: {
        type: StringConstructor;
        default: null;
        validator: (url: unknown) => any;
    };
}, any, any, {
    backgroundPath(): any;
    backgroundColor(): any;
    componentColor(): "hsl(200, 5%, 76.5%)";
    componentBackgroundTransformation(): string;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Node type, e.g. "Learner", "Visualizer"
     * as defined in org.knime.core.node.NodeFactory.NodeType.
     * Is undefined for MetaNodes
     */
    type: {
        type: StringConstructor;
        default: null;
    };
    /**
     * Differentiate between a native node and a component node
     */
    isComponent: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * data-url containing Base64-encoded icon
     */
    icon: {
        type: StringConstructor;
        default: null;
        validator: (url: unknown) => any;
    };
}>>, {
    type: string;
    icon: string;
    isComponent: boolean;
}, {}>;
export default _default;
