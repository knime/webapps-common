declare const _default: import("vue").DefineComponent<{
    tabindex: {
        type: NumberConstructor;
        default: null;
    };
}, unknown, {
    isMouseDown: boolean;
    wasDragged: boolean;
}, {}, {
    onMouseDown(e: MouseEvent): void;
    onMouseEnd(e: MouseEvent): void;
    onMouseMove(e: MouseEvent): void;
    onDragStart(e: MouseEvent): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    tabindex: {
        type: NumberConstructor;
        default: null;
    };
}>>, {
    tabindex: number;
}, {}>;
export default _default;
