declare const _default: import("vue").DefineComponent<{
    modelValue: {
        type: ArrayConstructor;
        default: null;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
    acceptedFileTypes: {
        type: StringConstructor;
        default: string;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, any, {
    displayedFilename(): any;
    fileSelectorId(): string;
    selectFileText(): string;
}, {
    openFileSelector(): void;
    onSelect(event: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        type: ArrayConstructor;
        default: null;
    };
    label: {
        type: StringConstructor;
        default: string;
    };
    acceptedFileTypes: {
        type: StringConstructor;
        default: string;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    label: string;
    multiple: boolean;
    modelValue: unknown[];
    acceptedFileTypes: string;
}, {}>;
export default _default;
