export enum ColorModelType {
    NUMERIC = 'NUMERIC',
    NOMINAL = 'NOMINAL'
}

export type NumericColorModel = {
    minValue: number;
    maxValue: number;
    minColor: string;
    maxColor: string;
};

export type ColorModel = {
    type: ColorModelType.NUMERIC;
    model: NumericColorModel;
} | {
    type: ColorModelType.NOMINAL;
    model: Record<string, string>;
}
