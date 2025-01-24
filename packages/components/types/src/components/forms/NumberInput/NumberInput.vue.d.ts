/// <reference types="node" />
import type { PropType } from "vue";
import "../variables.css";
declare const _default: import("vue").DefineComponent<{
    modelValue: {
        default: number;
        type: PropType<string | number>;
        validator(value: unknown): boolean;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    min: {
        default: number;
        type: NumberConstructor;
    };
    max: {
        default: number;
        type: NumberConstructor;
    };
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Sets the significant digit of the spinner input.
     *
     * Possible values: 'double' | 'integer'
     */
    type: {
        default: string;
        type: PropType<"double" | "integer">;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, {
    clicked: boolean;
    hovered: boolean;
    initialValue: number;
    localValue: string | number;
    spinnerArrowTimeout: string | number | NodeJS.Timeout | null | undefined;
    spinnerArrowInterval: string | number | NodeJS.Timeout | null | undefined;
}, {
    isInteger(): boolean;
    stepSize(): 1 | 0.1;
    inputClassList(): string;
    inputValue(): string | number;
}, {
    getInputRef(): HTMLInputElement;
    parseValue(value: string | number): number;
    getParsedValue(): number;
    onInput(event: InputEvent): void;
    updateAndEmit({ newValue }: {
        newValue: string | number;
    }): void;
    onBlur(): void;
    validate(value: undefined | number | string): {
        isValid: boolean;
        errorMessage: string | undefined;
    };
    /**
     * Change value updates the actual value of the input field if a valid new value
     * can be found. It prevents users from further invalidating the value in the input
     * by moving in the wrong direction (lower than min/higher than max).
     *
     * @param  {Number} increment - the amount by which to change the current value.
     * @returns {undefined}
     */
    changeValue(increment: number): void;
    findNearestValidValue(value: number): number;
    /**
     * This method is the callback handler for mouse events on the input field controls.
     * It is fired when either the up-arrow or down-arrow is pressed by the user. It manages
     * both mousedown and mouseup events. It clears any existing timeouts or intervals which
     * may have been set previously. It also recognizes when the mouse leaves the button
     * (which could cause a mouseup event to be missed) and therefore uses the this.clicked
     * data property to ensure it doesn't get stuck in an interval.
     *
     * @param {Event} e - the DOM event object which triggered the handler.
     * @param {String} type - the type of button pressed (either 'increased' or 'decreased').
     * @returns {undefined}
     */
    mouseEvent(e: MouseEvent, type: "increase" | "decrease"): void;
    toggleHover(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        default: number;
        type: PropType<string | number>;
        validator(value: unknown): boolean;
    };
    id: {
        type: StringConstructor;
        default: null;
    };
    name: {
        type: StringConstructor;
        default: null;
    };
    min: {
        default: number;
        type: NumberConstructor;
    };
    max: {
        default: number;
        type: NumberConstructor;
    };
    /**
     * Validity controlled by the parent component to be flexible.
     */
    isValid: {
        default: boolean;
        type: BooleanConstructor;
    };
    /**
     * Sets the significant digit of the spinner input.
     *
     * Possible values: 'double' | 'integer'
     */
    type: {
        default: string;
        type: PropType<"double" | "integer">;
    };
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    type: "double" | "integer";
    name: string;
    compact: boolean;
    disabled: boolean;
    modelValue: string | number;
    id: string;
    max: number;
    min: number;
    isValid: boolean;
    inputClasses: string;
}, {}>;
export default _default;
