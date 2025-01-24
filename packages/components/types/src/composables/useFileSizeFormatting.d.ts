import { type Ref } from "vue";
import { partial } from "filesize";
type FileSizeOptions = Parameters<typeof partial>[0];
type UseFileSizeFormattingOptions = {
    size: Ref<number>;
    fileSizeOptions?: FileSizeOptions;
};
export declare const useFileSizeFormatting: (options: UseFileSizeFormattingOptions) => {
    formattedSize: import("vue").ComputedRef<string | number | any[] | {
        value: any;
        symbol: any;
        exponent: number;
        unit: string;
    }>;
};
export {};
