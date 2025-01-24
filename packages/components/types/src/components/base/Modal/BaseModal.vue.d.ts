/**
 * A reusable component which has an overlay and a slot for content. It contains the styles and animations needed for
 * a smooth, full-size modal capable of replacing `window.alert` or displaying messaging within a container element.
 *
 * This component blocks pointer-events with the overlay but emits an event when there is a click away from the modal
 * content; allowing the parent component to minimize or remove the modal as needed.
 *
 * Note that the widget width can be set vial the `--modal-width` CSS property, which defaults to `550px`.
 */
declare const _default: import("vue").DefineComponent<{
    /**
     * Opens and closes the alert from the parent.
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
    implicitDismiss: {
        type: BooleanConstructor;
        default: boolean;
    };
    animate: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    /**
     * 'showContent' is used to animate the modal content separately
     */
    showContent: boolean;
}, {}, {
    onGlobalKeyUp(event: KeyboardEvent): void;
    /**
     * Detects any clicks on the overlay or the escape key, allowing the modal to be dismissed
     * without having to click a specific button or control.
     *
     */
    onOverlayClick(): void;
    /**
     * can be used by parent to close the modal.
     */
    cancel(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "cancel"[], "cancel", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Opens and closes the alert from the parent.
     */
    active: {
        type: BooleanConstructor;
        default: boolean;
    };
    implicitDismiss: {
        type: BooleanConstructor;
        default: boolean;
    };
    animate: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    onCancel?: ((...args: any[]) => any) | undefined;
}, {
    animate: boolean;
    active: boolean;
    implicitDismiss: boolean;
}, {}>;
export default _default;
