import { type Ref } from "vue";
type ClickOutsideParams = {
    targets: Ref<HTMLElement | null>[];
    callback: (event: PointerEvent) => void;
};
declare const _default: ({ targets, callback }: ClickOutsideParams, active?: Ref<boolean>) => void;
export default _default;
