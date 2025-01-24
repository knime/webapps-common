import { type PropType } from "vue";
/**
 * See demo for documentation
 */
declare const _default: import("vue").DefineComponent<{
    /**
     * @see {@link BaseModal.vue}
     */
    title: {
        default: null;
        type: StringConstructor;
    };
    /**
     * One of 'info', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling,
     */
    styleType: {
        type: PropType<"warn" | "info">;
        default: string;
        validator(type?: "info" | "warn"): boolean;
    };
    implicitDismiss: {
        type: BooleanConstructor;
        default: boolean;
    };
    animate: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {}, {
    onCloserClick(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "cancel"[], "cancel", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * @see {@link BaseModal.vue}
     */
    title: {
        default: null;
        type: StringConstructor;
    };
    /**
     * One of 'info', 'warn'. Defaults to 'info'.
     * This has no implication on functionality, only styling,
     */
    styleType: {
        type: PropType<"warn" | "info">;
        default: string;
        validator(type?: "info" | "warn"): boolean;
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
    title: string;
    animate: boolean;
    implicitDismiss: boolean;
    styleType: "warn" | "info";
}, {}>;
export default _default;
