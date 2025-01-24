declare const _default: import("vue").DefineComponent<{
    /** The value of the wedge to be displayed, can exceed the maximum value */
    value: {
        type: (ObjectConstructor | NumberConstructor)[];
        required: true;
    };
    /**
     * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
     * Note this will not be displayed as inner value.
     */
    secondaryValue: {
        type: (ObjectConstructor | NumberConstructor)[];
        default: number;
    };
    /** The maximum value on which the wedge size is calculated. Also 'Infinity' can be passed here */
    maxValue: {
        type: NumberConstructor;
        required: true;
    };
    /** Wether or not values larger than the maximum are allowed. If this is false larger values will be clipped to
     * the maxValue. */
    acceptValuesLargerThanMax: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The outside radius of the donut chart. This also determines the overall size of the component. */
    radius: {
        type: NumberConstructor;
        default: number;
    };
    /** The inner radius. This can be seen as the radius of the donut hole. */
    innerRadius: {
        type: NumberConstructor;
        default: number;
    };
    /** Whether or not the wedge and max values are displayed as a label inside the donut hole. */
    displayValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** An additional label string, which is shown beneath the value label, if present. Does not display
     * if 'displayValues === false' */
    additionalLabel: {
        type: StringConstructor;
        default: null;
    };
    /** optional parameter wether the transition between values should be animated or not */
    animate: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    backgroundStrokeOffset: number;
    smallLabelFontSize: number;
    regularLabelFontSize: number;
    regularLabelMaxValue: number;
}, {
    primarySegment(): any;
    secondarySegment(): any;
    clippedValue(): number;
    secondaryClippedValue(): number;
    strokeWidth(): number;
    backgroundStrokeWidth(): number;
    r(): number;
    diameter(): number;
    viewBox(): string;
    circumference(): number;
    strokeDashOffset(): number;
    secondaryStrokeDashOffset(): number;
    transformWedge(): string;
    displayLabel(): boolean;
    maxValueString(): string;
    containerStyle(): string;
    labelStyle(): string;
    disabled(): boolean;
}, {
    calcStrokeDashOffset(value: any): number;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** The value of the wedge to be displayed, can exceed the maximum value */
    value: {
        type: (ObjectConstructor | NumberConstructor)[];
        required: true;
    };
    /**
     * An optional secondary value for a second wedge to be displayed, can exceed the maximum value.
     * Note this will not be displayed as inner value.
     */
    secondaryValue: {
        type: (ObjectConstructor | NumberConstructor)[];
        default: number;
    };
    /** The maximum value on which the wedge size is calculated. Also 'Infinity' can be passed here */
    maxValue: {
        type: NumberConstructor;
        required: true;
    };
    /** Wether or not values larger than the maximum are allowed. If this is false larger values will be clipped to
     * the maxValue. */
    acceptValuesLargerThanMax: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** The outside radius of the donut chart. This also determines the overall size of the component. */
    radius: {
        type: NumberConstructor;
        default: number;
    };
    /** The inner radius. This can be seen as the radius of the donut hole. */
    innerRadius: {
        type: NumberConstructor;
        default: number;
    };
    /** Whether or not the wedge and max values are displayed as a label inside the donut hole. */
    displayValues: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** An additional label string, which is shown beneath the value label, if present. Does not display
     * if 'displayValues === false' */
    additionalLabel: {
        type: StringConstructor;
        default: null;
    };
    /** optional parameter wether the transition between values should be animated or not */
    animate: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    animate: boolean;
    secondaryValue: number | Record<string, any>;
    acceptValuesLargerThanMax: boolean;
    radius: number;
    innerRadius: number;
    displayValues: boolean;
    additionalLabel: string;
}, {}>;
export default _default;
