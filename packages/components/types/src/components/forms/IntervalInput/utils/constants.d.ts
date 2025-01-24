import { intervalUtils } from "@knime/utils";
export declare const periodNumericKeys: (keyof intervalUtils.Period)[];
export declare const durationNumericKeys: (keyof intervalUtils.Duration)[];
export declare const bounds: {
    [key: string]: {
        min: number;
        max: number;
    };
};
