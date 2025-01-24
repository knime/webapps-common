import type { VideoSource } from "../types";
interface Props {
    title: string;
    description: string;
    linkText?: string;
    linkHref?: string;
    video?: VideoSource;
    hideButtons?: boolean;
}
declare const _default: import("vue").DefineComponent<__VLS_TypePropsToOption<Props>, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    skipAll: () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_TypePropsToOption<Props>>> & {
    onClose?: (() => any) | undefined;
    onSkipAll?: (() => any) | undefined;
}, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
