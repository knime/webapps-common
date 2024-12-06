export type ColorModelType = "NUMERIC" | "NOMINAL";

export type NumericColorModel = {
  minValue: number;
  maxValue: number;
  minColor: string;
  maxColor: string;
};

export type ColorModel =
  | {
      type: "NUMERIC";
      model: NumericColorModel;
    }
  | {
      type: "NOMINAL";
      model: Record<string, string>;
    };
