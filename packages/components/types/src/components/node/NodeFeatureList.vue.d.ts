declare const _default: import("vue").DefineComponent<{
    /** Passed through to PortsList.vue */
    inPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    outPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    dynInPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    dynOutPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to DialogOptions.vue */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to ViewsList.vue */
    views: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Text that is show if node has neither views, options nor ports */
    emptyText: {
        type: StringConstructor;
        default: string;
    };
    /** Passed through to DialogOptions.vue */
    sanitizeContent: {
        type: BooleanConstructor;
        default: boolean;
    };
}, any, {
    activeTab: null;
}, {
    hasPorts(): boolean;
    possibleTabValues(): {
        value: string;
        label: string;
        icon: FunctionalComponent<SVGAttributes>;
        disabled: boolean;
    }[];
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** Passed through to PortsList.vue */
    inPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    outPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    dynInPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to PortsList.vue */
    dynOutPorts: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to DialogOptions.vue */
    options: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Passed through to ViewsList.vue */
    views: {
        type: ArrayConstructor;
        default: () => never[];
    };
    /** Text that is show if node has neither views, options nor ports */
    emptyText: {
        type: StringConstructor;
        default: string;
    };
    /** Passed through to DialogOptions.vue */
    sanitizeContent: {
        type: BooleanConstructor;
        default: boolean;
    };
}>>, {
    options: unknown[];
    sanitizeContent: boolean;
    inPorts: unknown[];
    outPorts: unknown[];
    dynInPorts: unknown[];
    dynOutPorts: unknown[];
    views: unknown[];
    emptyText: string;
}, {}>;
export default _default;
