import * as convert from "color-convert";

import type {
  CIELabColor,
  ColorModel,
  MinMaxRGBHexModel,
  NumericColorModel,
  StopValuesCIELabModel,
  UIExtensionService,
} from "@knime/ui-extension-renderer/api";

import { AbstractService } from "./AbstractService";
import type { ColorServiceAPILayer } from "./types/serviceApiLayers";

// TODO UIEXT-858 Provide this default color via color model
const lightGray = "#D3D3D3";
const darkGray = "#404040";
const maxColorValue = 255;

abstract class AbstractColorHandler<Model> {
  private colorModel: Model;

  constructor(model: Model) {
    this.colorModel = model;
  }

  public abstract getColor(value: string | number | null): string;

  public getColorModel(): Model {
    return this.colorModel;
  }
}

const interpolate = (min: number, max: number, ratio: number) => {
  const interpolated = Math.round(min + (max - min) * ratio);
  const minColorValue = 0;
  if (interpolated < minColorValue) {
    return minColorValue;
  }
  if (interpolated > maxColorValue) {
    return maxColorValue;
  }
  return interpolated;
};

const convertCIELabToHex = (cielab: CIELabColor): string => {
  const [l, a, b, alpha] = cielab;

  const hex = convert.lab.hex([l, a, b]);
  const hexBase = 16;
  const hexPartLength = 2;
  const alphaHex = Math.round(alpha * maxColorValue)
    .toString(hexBase)
    .padStart(hexPartLength, "0")
    .toUpperCase();
  return `#${hex}${alphaHex}`;
};

const isMinMaxRGBModel = (
  model: NumericColorModel,
): model is MinMaxRGBHexModel => "minColor" in model;

export abstract class NumericColorHandler<
  Model extends NumericColorModel = NumericColorModel,
> extends AbstractColorHandler<Model> {
  public abstract getColor(value: number | null): string;
}

abstract class NumericColorHandlerWithModel<
  Model extends NumericColorModel,
> extends NumericColorHandler<Model> {}

export class MinMaxRGBColorHandler extends NumericColorHandlerWithModel<MinMaxRGBHexModel> {
  rgbMin: [number, number, number];
  rgbMax: [number, number, number];
  getRatio: (value: number) => number;

  constructor(model: MinMaxRGBHexModel) {
    super(model);
    const { minColor, maxColor, minValue, maxValue } = model;
    this.rgbMin = convert.hex.rgb(minColor);
    this.rgbMax = convert.hex.rgb(maxColor);
    this.getRatio = (value) => (value - minValue) / (maxValue - minValue);
  }

  public getColor(value: number): string {
    const ratio = this.getRatio(value);

    const interpolated = Array.from({ length: 3 }, (_v, i) =>
      interpolate(this.rgbMin[i], this.rgbMax[i], ratio),
    ) as [number, number, number];

    return `#${convert.rgb.hex(interpolated)}`;
  }
}

export class CIELabColorHandler extends NumericColorHandler<StopValuesCIELabModel> {
  public getColor(value: number | null): string {
    const { stopValues, stopColorsCIELab, specialColors } =
      this.getColorModel();

    // Handle null/missing values
    if (value === null) {
      return convertCIELabToHex(specialColors.MISSING);
    }

    // Check for special values
    if (Number.isNaN(value)) {
      return convertCIELabToHex(specialColors.NAN);
    }
    if (value === Infinity) {
      return convertCIELabToHex(specialColors.POSITIVE_INFINITY);
    }
    if (value === -Infinity) {
      return convertCIELabToHex(specialColors.NEGATIVE_INFINITY);
    }
    if (value < stopValues[0]) {
      return this.getBelowMinColor();
    }
    if (value > stopValues[stopValues.length - 1]) {
      return this.getAboveMaxColor();
    }

    // Find the two stop values that bracket this value
    let segmentIndex = 0;
    while (
      segmentIndex < stopValues.length - 1 &&
      !(
        value >= stopValues[segmentIndex] &&
        value <= stopValues[segmentIndex + 1]
      )
    ) {
      segmentIndex++;
    }

    const value0 = stopValues[segmentIndex];
    const color0 = stopColorsCIELab[segmentIndex];
    const value1 = stopValues[segmentIndex + 1];
    const color1 = stopColorsCIELab[segmentIndex + 1];
    if (value1 === value0) {
      return convertCIELabToHex(color0);
    }
    const step = (value - value0) / (value1 - value0);

    // Interpolate in CIELab color space
    const l = color0[0] + step * (color1[0] - color0[0]);
    const a = color0[1] + step * (color1[1] - color0[1]);
    const b = color0[2] + step * (color1[2] - color0[2]);
    const alpha = color0[3] + step * (color1[3] - color0[3]);

    return convertCIELabToHex([l, a, b, alpha]);
  }

  public getCustomInterpolationContext(): {
    stopValues: number[];
    belowMinColor: string;
    aboveMaxColor: string;
  } {
    const model = this.getColorModel();
    return {
      stopValues: model.stopValues,
      belowMinColor: this.getBelowMinColor(),
      aboveMaxColor: this.getAboveMaxColor(),
    };
  }

  private getBelowMinColor(): string {
    const model = this.getColorModel();
    return convertCIELabToHex(model.specialColors.BELOW_MIN);
  }

  private getAboveMaxColor(): string {
    const model = this.getColorModel();
    return convertCIELabToHex(model.specialColors.ABOVE_MAX);
  }
}

export class NominalColorHandler extends AbstractColorHandler<
  Record<string, string>
> {
  public getColor(value: string | null): string {
    return value === null ? darkGray : this.getColorModel()[value] || lightGray;
  }
}

export type ColorHandler = NumericColorHandler | NominalColorHandler;

/**
 * A utility class to receive a color callback created by the color model provided by a
 * UI Extension node.
 */
export class ColorService extends AbstractService<ColorServiceAPILayer> {
  /**
   * Mapping from column name to attached color model given by the extension config.
   */
  private colorModels: Record<string, ColorModel>;
  private columnNamesColorModel: ColorModel | undefined;

  /**
   * @param {KnimeService} knimeService - knimeService instance which is used to communicate
   *      with the framework.
   */
  constructor(baseService: UIExtensionService<ColorServiceAPILayer>) {
    super(baseService);
    const { colorModels } = baseService.getConfig();
    if (!colorModels) {
      throw new Error("No color models present in the given extension config.");
    }
    this.colorModels = colorModels;
    this.columnNamesColorModel = baseService.getConfig().columnNamesColorModel;
  }

  public getColorHandler(columnName: string, suppressWarning: boolean = false) {
    if (columnName in this.colorModels) {
      const colorModel = this.colorModels[columnName];
      if (colorModel.type === "NUMERIC") {
        if (isMinMaxRGBModel(colorModel.model)) {
          return new MinMaxRGBColorHandler(colorModel.model);
        } else {
          return new CIELabColorHandler(colorModel.model);
        }
      } else {
        return new NominalColorHandler(colorModel.model);
      }
    }
    if (!suppressWarning) {
      this.baseService.sendAlert({
        type: "warn",
        warnings: [
          {
            message: `No color handler found for the given column name "${columnName}".`,
          },
        ],
      });
    }
    return null;
  }

  public getColumnNamesColorHandler() {
    if (this.columnNamesColorModel) {
      const { model, type } = this.columnNamesColorModel;
      if (type === "NOMINAL") {
        return new NominalColorHandler(model);
      } else {
        throw new Error(
          "The type of the column name color model is not correct.",
        );
      }
    }
    return null;
  }
}
