declare const _default: import("vue").DefineComponent<{
    /** display text for the download link */
    text: {
        type: StringConstructor;
        required: true;
    };
    href: {
        type: StringConstructor;
        required: true;
    };
    /** extension based file type: exe, txt, zip, docx etc. */
    fileExt: {
        type: StringConstructor;
        default: string;
    };
    mimeType: {
        type: StringConstructor;
        default: string;
    };
    /** size in kilobytes */
    size: {
        type: NumberConstructor;
        default: number;
    };
}, any, any, {
    icon(): string;
    humanFileSizeObject(): string | number | any[] | {
        value: any;
        symbol: any;
        exponent: number;
        unit: string;
    };
    humanFileSizeUnitFull(): any;
    hasFileInfo(): any;
    fileInfoText(): string;
    linkHtmlTitle(): any;
}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /** display text for the download link */
    text: {
        type: StringConstructor;
        required: true;
    };
    href: {
        type: StringConstructor;
        required: true;
    };
    /** extension based file type: exe, txt, zip, docx etc. */
    fileExt: {
        type: StringConstructor;
        default: string;
    };
    mimeType: {
        type: StringConstructor;
        default: string;
    };
    /** size in kilobytes */
    size: {
        type: NumberConstructor;
        default: number;
    };
}>>, {
    size: number;
    mimeType: string;
    fileExt: string;
}, {}>;
export default _default;
