declare const _default: import("vue").DefineComponent<{
    /**
     * Distinguish between 'table', 'flowVariable' and other types of ports
     * Determines the shape of the port:
     *   table -> triangle
     *   flowVariable -> circle
     *   default -> square
     */
    type: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Shape fill color. Format has to be valid for css. Only used by square ports.
     * Tables are always black, flow variables always red.
     */
    color: {
        type: StringConstructor;
        default: string;
    };
    filled: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    portSize(): 9;
    strokeWidth(): 1.4;
    trianglePath(): string;
    portColor(): any;
    fillColor(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Distinguish between 'table', 'flowVariable' and other types of ports
     * Determines the shape of the port:
     *   table -> triangle
     *   flowVariable -> circle
     *   default -> square
     */
    type: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Shape fill color. Format has to be valid for css. Only used by square ports.
     * Tables are always black, flow variables always red.
     */
    color: {
        type: StringConstructor;
        default: string;
    };
    filled: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    type: string;
    color: string;
    filled: boolean;
}, {}>;
export default _default;
