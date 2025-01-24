/**
 * HintPopover supports element being a querySelector string useful for useHint / createHint.
 * Includes PopoverContent for easier creation via h() function in createHint. Completes hint on click outside.
 */
import { type MaybeRef } from "vue";
import type { MaybeElement } from "../types";
import { type Props as BasePopoverProps } from "./BasePopover.vue";
import PopoverContent from "./PopoverContent.vue";
interface Props extends Omit<BasePopoverProps, "reference"> {
    content: InstanceType<typeof PopoverContent>["$props"];
    reference: string | MaybeRef<MaybeElement>;
    completeHint: () => void;
    skipAllHints: () => void;
}
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToOption<Props>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<Props>>>, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
