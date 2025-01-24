import { type PropType } from "vue";
import { type BaseRadioButtonItem } from "../RadioButtons/BaseRadioButtons.vue";
export type ValueSwitchItem = BaseRadioButtonItem;
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
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    compact: boolean;
    disabled: boolean;
    modelValue: string;
    id: string;
    possibleValues: BaseRadioButtonItem[];
}, {}>;
export default _default;
