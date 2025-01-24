import type { FunctionalComponent, PropType, SVGAttributes } from "vue";
export type BreadcrumbItem = {
    text?: string;
    href?: string;
    icon?: FunctionalComponent<SVGAttributes>;
    clickable?: boolean;
    title?: string;
    [key: string]: any;
};
declare const _default: import("vue").DefineComponent<{
    /**
     * items as array with a 'text' and optional properties 'href', 'icon' and 'clickable'
     *
     * Having "href" set will make the element behave as a link. Having the "clickable" property
     * set will make the component emit a "click-item" event when the corresponding item is clicked. "href" takes
     * precedence over "clickable"
     *
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', icon: Icon },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', clickable: true },
     *   { text: 'Sentiment Prediction via REST' }
     * ]
     */
    items: {
        type: PropType<BreadcrumbItem[] | null>;
        default: () => never[];
    };
    /**
     * focus and hover style can be switched by changing this value:
     * true - darker background, normal font
     * false - transparent background, bold font
     */
    greyStyle: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set to true to prevent line breaks in the breadcrumb
     * If elements are too wide, the first and the last two elements are shown preferentially.
     * Elements are shown in full on hover or focus.
     * On overflow, no scrollbar will be shown, but the breadcrumb will be scrollable
     */
    noWrap: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set to true to reduce the space between the breadcrumb items
     */
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}, unknown, unknown, {
    linkComponent(): import("vue").Component<any, any, any, import("vue").ComputedOptions, import("vue").MethodOptions, {}, any>;
    /**
     * Whether the items are rendered in reverse order from right to left
     * With that we achieve that the right-most elements
     * (which are the most important) stay visible initially on overflow
     */
    reverseItems(): boolean;
    breadcrumbItems(): BreadcrumbItem[] | null | undefined;
    rightMostItemIndex(): number;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "click-item": (_item: BreadcrumbItem) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * items as array with a 'text' and optional properties 'href', 'icon' and 'clickable'
     *
     * Having "href" set will make the element behave as a link. Having the "clickable" property
     * set will make the component emit a "click-item" event when the corresponding item is clicked. "href" takes
     * precedence over "clickable"
     *
     * e.g.
     * [
     *   { text: 'KNIME Hub', href: '/', icon: Icon },
     *   { text: 'John Doe', href: '/john.doe' },
     *   { text: 'Public Space', href: '/john.doe/space' },
     *   { text: 'Examples', clickable: true },
     *   { text: 'Sentiment Prediction via REST' }
     * ]
     */
    items: {
        type: PropType<BreadcrumbItem[] | null>;
        default: () => never[];
    };
    /**
     * focus and hover style can be switched by changing this value:
     * true - darker background, normal font
     * false - transparent background, bold font
     */
    greyStyle: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set to true to prevent line breaks in the breadcrumb
     * If elements are too wide, the first and the last two elements are shown preferentially.
     * Elements are shown in full on hover or focus.
     * On overflow, no scrollbar will be shown, but the breadcrumb will be scrollable
     */
    noWrap: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set to true to reduce the space between the breadcrumb items
     */
    compact: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onClick-item"?: ((_item: BreadcrumbItem) => any) | undefined;
}, {
    items: BreadcrumbItem[] | null;
    greyStyle: boolean;
    noWrap: boolean;
    compact: boolean;
}, {}>;
export default _default;
