import type { PropType } from "vue";
interface LinkItem {
    text?: string;
    url: string;
}
/**
 * Renders a list of clickable links displayed with an arrow icon and text
 *
 * Example:
 * -> Google
 * -> KNIME Hub
 */
declare const _default: import("vue").DefineComponent<{
    links: {
        type: PropType<LinkItem[]>;
        default: () => never[];
    };
}, unknown, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    links: {
        type: PropType<LinkItem[]>;
        default: () => never[];
    };
}>>, {
    links: LinkItem[];
}, {}>;
export default _default;
