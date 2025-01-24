declare const _default: import("vue").DefineComponent<{
    /**
     * Make the whole tab bar read-only
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Selected value. Should be one of the value attributes in the `possibleValues` prop.
     */
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Name of the form elements. This is useful when using the tab bar inside a <form>.
     * Defaults to `value`.
     * If you have multiple tab bars on one page, make sure to include them in separate forms or use unique `name`
     * properties. Otherwise the browser will not allow to select more than one tab in total.
     */
    name: {
        type: StringConstructor;
        default: string;
    };
    /**
         * @example
           [{
               value: 'all',
               label: 'All',
               icon: null,
               title: 'everything',
               disabled: false
           }, {
               value: 'nodes',
               label: 'Nodes',
               icon: NodeIcon,
               title: 'Nodes!',
               disabled: true
           }, {
               value: 'workflows',
               label: 'Workflows',
               icon: WorkflowIcon,
               disabled: true
           }]
         */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
        validator(items?: unknown): boolean;
    };
}, {
    localModelValue: import("vue").Ref<string>;
}, any, {}, {
    onChange(value: any): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:modelValue"[], "update:modelValue", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Make the whole tab bar read-only
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Selected value. Should be one of the value attributes in the `possibleValues` prop.
     */
    modelValue: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Name of the form elements. This is useful when using the tab bar inside a <form>.
     * Defaults to `value`.
     * If you have multiple tab bars on one page, make sure to include them in separate forms or use unique `name`
     * properties. Otherwise the browser will not allow to select more than one tab in total.
     */
    name: {
        type: StringConstructor;
        default: string;
    };
    /**
         * @example
           [{
               value: 'all',
               label: 'All',
               icon: null,
               title: 'everything',
               disabled: false
           }, {
               value: 'nodes',
               label: 'Nodes',
               icon: NodeIcon,
               title: 'Nodes!',
               disabled: true
           }, {
               value: 'workflows',
               label: 'Workflows',
               icon: WorkflowIcon,
               disabled: true
           }]
         */
    possibleValues: {
        type: ArrayConstructor;
        default: () => never[];
        validator(items?: unknown): boolean;
    };
}>> & {
    "onUpdate:modelValue"?: ((...args: any[]) => any) | undefined;
}, {
    name: string;
    disabled: boolean;
    modelValue: string;
    possibleValues: unknown[];
}, {}>;
export default _default;
