declare const _default: import("vue").DefineComponent<{
    modelValue: {
        default: number;
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
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
     * Minimum number of digits shown, non existent digits will be filled with zeros (0)
     * e.g 3 -> 001, no leading zeros with the default 0
     */
    minDigits: {
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
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    compact: {
        default: boolean;
        type: BooleanConstructor;
    };
}, any, {
    clicked: boolean;
    hovered: boolean;
    localValue: string | number;
}, {
    stepSize(): 1;
    inputClassList(): any;
}, {
    /**
     * Check min/max limits and return details about it
     * @param {Number} value - value to check for min/max bounds
     * @returns {Object} - bounds info object also used for @bounds event
     */
    limitBounds(value: number): Object;
    /**
     * Pad with zeros based on minDigits prop
     *
     * @param {Number} value
     * @returns {String|Number}
     */
    padValue(value: number): string | number;
    getValue(): number;
    onBlur(): void;
    onInput(event: any): void;
    validate(value: any): {
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
    changeValue(increment: number): undefined;
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
    mouseEvent(e: Event, type: string): undefined;
    toggleHover(): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("update:modelValue" | "bounds")[], "update:modelValue" | "bounds", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    modelValue: {
        default: number;
        type: (StringConstructor | NumberConstructor)[];
    };
    id: {
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
     * Minimum number of digits shown, non existent digits will be filled with zeros (0)
     * e.g 3 -> 001, no leading zeros with the default 0
     */
    minDigits: {
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
    inputClasses: {
        default: string;
        type: StringConstructor;
    };
    disabled: {
        default: boolean;
        type: BooleanConstructor;
    };
    compact: {
        default: boolean;
        type: BooleanConstructor;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
    onBounds?: ((...args: any[]) => any) | undefined;
}, {
    compact: boolean;
    disabled: boolean;
    modelValue: string | number;
    id: string;
    max: number;
    min: number;
    isValid: boolean;
    inputClasses: string;
    minDigits: number;
}, {}>;
export default _default;
