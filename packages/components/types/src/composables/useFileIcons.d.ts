import { type Ref } from "vue";
type UseFileIconOptions = {
    filename: Ref<string>;
};
/**
 * Determines which icon to use for a given file name (based on the extension),
 * defaulting to a general FileIcon when no suitable icon is found
 */
export declare const useFileIcon: (options: UseFileIconOptions) => {
    icon: import("vue").ComputedRef<any>;
};
export {};
