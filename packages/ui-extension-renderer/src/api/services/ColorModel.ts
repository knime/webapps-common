export type ColorModelType = "NUMERIC" | "NOMINAL";

/**
 * CIELab color representation
 */
export type CIELabColor = [l: number, a: number, b: number, alpha: number];

/**
 * To be interpolated using RGB color space
 */
export type MinMaxRGBHexModel = {
  minColor: string;
  maxColor: string;
  minValue: number;
  maxValue: number;
};

/**
 * Special colors for special numeric values in CIELab color space
 */
export type SpecialColors = {
  MISSING: CIELabColor;
  NAN: CIELabColor;
  NEGATIVE_INFINITY: CIELabColor;
  BELOW_MIN: CIELabColor;
  ABOVE_MAX: CIELabColor;
  POSITIVE_INFINITY: CIELabColor;
};

/**
 * To be interpolated using CIELab color space
 */
export type StopValuesCIELabModel = {
  stopValues: number[];
  stopColorsCIELab: CIELabColor[];
  specialColors: SpecialColors;
};

export type NumericColorModel = MinMaxRGBHexModel | StopValuesCIELabModel;

export type ColorModel =
  | {
      type: "NUMERIC";
      model: NumericColorModel;
    }
  | {
      type: "NOMINAL";
      model: Record<string, string>;
    };
