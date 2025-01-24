import { type PropType } from "vue";
export type BaseRadioButtonItem = {
    id: string;
    text: string;
    subtext?: string;
    disabled?: boolean;
};
declare const _default: import("vue").DefineComponent<{
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    possibleValues: {
        type: PropType<BaseRadioButtonItem[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
}, unknown, unknown, {
    inputName(): string;
}, {
    onInput($event: Event): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: {
        type: StringConstructor;
        default: null;
    };
    modelValue: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    possibleValues: {
        type: PropType<BaseRadioButtonItem[]>;
        default: () => never[];
        validator(values: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    disabled: boolean;
    modelValue: string;
    id: string;
    possibleValues: BaseRadioButtonItem[];
}, {}>;
export default _default;
