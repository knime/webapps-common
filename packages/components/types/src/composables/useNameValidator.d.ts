import { type Ref } from "vue";
type UseNameValidatorOptions = {
    name: Ref<string>;
    blacklistedNames: Ref<Array<string>>;
    unavailableNameMessage?: string;
};
export declare const useNameValidator: (options: UseNameValidatorOptions) => {
    isValid: import("vue").ComputedRef<boolean>;
    errorMessage: import("vue").ComputedRef<string>;
    cleanedName: import("vue").ComputedRef<string>;
};
export {};
