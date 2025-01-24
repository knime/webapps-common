import { type CSSProperties, type Ref } from "vue";
type UseIconFlipperOptions = {
    active: Ref<boolean>;
    initialRotation?: `${string}deg`;
};
export declare const useIconFlipper: (options: UseIconFlipperOptions) => {
    iconFlipStyles: import("vue").ComputedRef<CSSProperties>;
};
export {};
