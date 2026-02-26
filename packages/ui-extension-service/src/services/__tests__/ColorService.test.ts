import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type CIELabColor,
  type ColorModel,
  type SpecialColors,
  type UIExtensionService,
} from "@knime/ui-extension-renderer/api";
import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import {
  ColorService,
  NominalColorHandler,
  NumericColorHandler,
} from "../ColorService";
import type { ColorServiceAPILayer } from "../types/serviceApiLayers";

import { extensionConfig } from "./mocks";

const createServices = ({
  colorModels = {},
  columnNamesColorModel = undefined,
}: {
  colorModels?: Record<string, ColorModel>;
  columnNamesColorModel?: ColorModel;
}) => {
  const config = { ...extensionConfig, colorModels, columnNamesColorModel };
  const knimeService = setUpCustomEmbedderService<ColorServiceAPILayer>({
    sendAlert: vi.fn(),
    getConfig: () => config,
  }).service;
  const colorService = new ColorService(knimeService);

  return { config, knimeService, colorService };
};

describe("ColorService", () => {
  const numericColumnName = "nominalColumn";
  const nominalColumnName = "numericColumn";

  let colorService: ColorService,
    uiExtensionService: UIExtensionService<ColorServiceAPILayer>;

  const colorModels: Record<string, ColorModel> = {
    [numericColumnName]: {
      type: "NUMERIC",
      model: {
        minColor: "#0000FF",
        maxColor: "#FF0000",
        minValue: 0,
        maxValue: 100,
      },
    },
    [nominalColumnName]: {
      type: "NOMINAL",
      model: {
        red: "#FF0000",
        green: "#00FF00",
        blue: "#0000FF",
      },
    },
  };

  beforeEach(() => {
    ({ knimeService: uiExtensionService, colorService } = createServices({
      colorModels,
    }));
  });

  const defaultColor = "#D3D3D3";
  const missingValueColor = "#404040";

  describe("getColorCallback", () => {
    it("returns null and sets a warning if the column does not have a color handler", () => {
      expect(colorService.getColorHandler("foo")).toBeNull();
      expect(uiExtensionService.sendAlert).toHaveBeenCalled();
    });

    it("does not set a warning if suppressed", () => {
      colorService.getColorHandler("foo", true);
      expect(uiExtensionService.sendAlert).not.toHaveBeenCalled();
    });

    it("returns a function for nominal color model", () => {
      const colorHandler = colorService.getColorHandler(
        nominalColumnName,
      ) as NominalColorHandler;

      expect(colorHandler.getColor("red")).toBe("#FF0000");
      expect(colorHandler.getColor("green")).toBe("#00FF00");
      expect(colorHandler.getColor("blue")).toBe("#0000FF");
      expect(colorHandler.getColor("other")).toBe(defaultColor);
      expect(colorHandler.getColor(null)).toBe(missingValueColor);
    });

    it("returns a function for numeric color model", () => {
      const colorHandler = colorService.getColorHandler(
        numericColumnName,
      ) as NumericColorHandler;

      expect(colorHandler.getColor(0)).toBe("#0000FF");
      expect(colorHandler.getColor(50)).toBe("#800080");
      expect(colorHandler.getColor(100)).toBe("#FF0000");
      expect(colorHandler.getColor(200)).toBe("#FF0000");
      expect(colorHandler.getColor(-100)).toBe("#0000FF");
    });
  });

  describe("getColumnNamesColorHandler", () => {
    it("returns null if no column names color model is given", () => {
      expect(colorService.getColumnNamesColorHandler()).toBeNull();
    });

    it("returns the given column names color model", () => {
      const columnNamesColorModel: ColorModel = {
        type: "NOMINAL",
        model: {
          column1: "#FF0000",
          column2: "#00FF00",
          column3: "#0000FF",
        },
      };
      ({ knimeService: uiExtensionService, colorService } = createServices({
        columnNamesColorModel,
      }));

      const colorHandler =
        colorService.getColumnNamesColorHandler() as NominalColorHandler;
      expect(colorHandler.getColor("column1")).toBe("#FF0000");
      expect(colorHandler.getColor("column2")).toBe("#00FF00");
      expect(colorHandler.getColor("column3")).toBe("#0000FF");
      expect(colorHandler.getColor("other")).toBe(defaultColor);
    });

    it("throws an Error in case the model is not nominal", () => {
      ({ knimeService: uiExtensionService, colorService } = createServices({
        columnNamesColorModel: colorModels[numericColumnName],
      }));

      expect(() => colorService.getColumnNamesColorHandler()).toThrowError();
    });
  });

  describe("test CIELab Color Handler", () => {
    const specialColors: SpecialColors = {
      MISSING: [0, 0, 0, 1], // Black -> #000000FF
      NAN: [100, 0, 0, 1], // White -> #FFFFFFFF
      NEGATIVE_INFINITY: [50, -50, 0, 1], // Cyan-ish -> #008B76FF
      BELOW_MIN: [25, 0, 0, 1], // Dark gray -> #3B3B3BFF
      ABOVE_MAX: [75, 0, 0, 1], // Light gray -> #B9B9B9FF
      POSITIVE_INFINITY: [100, 50, 50, 1], // Yellow-ish -> #FFD6A0FF
    };

    const createCIELabColorModel = (
      stopValues: number[],
      stopColors: CIELabColor[],
    ): ColorModel => {
      return {
        type: "NUMERIC",
        model: {
          stopValues,
          stopColorsCIELab: stopColors,
          specialColors,
        },
      };
    };

    const cielabColumnName = "cielabColumn";

    const setupColorService = (
      stopValues: number[],
      stopColors: CIELabColor[],
    ) => {
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(stopValues, stopColors),
      };
      return createServices({ colorModels });
    };

    it("handles basic CIELab interpolation between two stop values", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 1], // Black
          [100, 0, 0, 1], // White
        ],
      ));
      const colorHandler = colorService.getColorHandler(cielabColumnName);

      expect(colorHandler).not.toBeNull();
      expect(colorHandler).toBeInstanceOf(NumericColorHandler);

      const numericColorHandler = colorHandler as NumericColorHandler;

      // Test interpolation at key points
      const color0 = numericColorHandler!.getColor(0);
      const color50 = numericColorHandler!.getColor(50);
      const color100 = numericColorHandler!.getColor(100);

      expect(color0).toBeDefined();
      expect(color50).toBeDefined();
      expect(color100).toBeDefined();
      expect(color0).not.toBe(color50);
      expect(color50).not.toBe(color100);
    });

    it("handles multiple stop values with interpolation", () => {
      ({ colorService } = setupColorService(
        [0, 50, 100],
        [
          [0, 0, 0, 1], // Black at 0
          [50, 50, 0, 1], // Mid-tone at 50
          [100, 0, 0, 1], // White at 100
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      // Test interpolation in different ranges
      const color25 = colorHandler!.getColor(25);
      const color75 = colorHandler!.getColor(75);

      expect(color25).toBeDefined();
      expect(color75).toBeDefined();
      expect(color25).not.toBe(color75);
    });

    it("handles special color for null/missing values", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const missingColor = colorHandler!.getColor(null);
      expect(missingColor).toBe("#000000FF");
    });

    it("handles special color for NaN", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const nanColor = colorHandler!.getColor(NaN);
      expect(nanColor).toBe("#FFFFFFFF");
    });

    it("handles special color for positive infinity", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const infColor = colorHandler!.getColor(Infinity);
      expect(infColor).toBe("#FFD6A0FF");
    });

    it("handles special color for negative infinity", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const negInfColor = colorHandler!.getColor(-Infinity);
      expect(negInfColor).toBe("#008B76FF");
    });

    it("handles values below minimum with BELOW_MIN special color", () => {
      ({ colorService } = setupColorService(
        [10, 100],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const belowMinColor = colorHandler!.getColor(5);
      expect(belowMinColor).toBe("#3B3B3BFF");
    });

    it("handles values above maximum with ABOVE_MAX special color", () => {
      ({ colorService } = setupColorService(
        [0, 90],
        [
          [0, 0, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const aboveMaxColor = colorHandler!.getColor(95);
      expect(aboveMaxColor).toBe("#B9B9B9FF");
    });

    it("handles equal step values without division by zero", () => {
      ({ colorService } = setupColorService(
        [50, 50, 100],
        [
          [0, 0, 0, 1],
          [50, 50, 0, 1],
          [100, 0, 0, 1],
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      // Should return the color at the stop value without error
      const color50 = colorHandler!.getColor(50);
      expect(color50).toBe("#000000FF");
    });

    it("provides custom interpolation context with stop values and boundary colors", () => {
      const stopValues = [0, 50, 100];
      ({ colorService } = setupColorService(stopValues, [
        [0, 0, 0, 1],
        [50, 50, 0, 1],
        [100, 0, 0, 1],
      ]));
      const colorHandler = colorService.getColorHandler(cielabColumnName);

      // Test the new getCustomInterpolationContext method
      expect(colorHandler).toBeDefined();
      expect("getCustomInterpolationContext" in colorHandler!).toBe(true);

      const context = (colorHandler as any).getCustomInterpolationContext();
      expect(context).toBeDefined();
      expect(context.stopValues).toEqual(stopValues);
      expect(context.belowMinColor).toBe("#3B3B3BFF");
      expect(context.aboveMaxColor).toBe("#B9B9B9FF");
    });

    it("preserves alpha channel in CIELab interpolation", () => {
      ({ colorService } = setupColorService(
        [0, 100],
        [
          [0, 0, 0, 0.5], // Half transparent
          [100, 0, 0, 1.0], // Fully opaque
        ],
      ));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const color0 = colorHandler!.getColor(0);
      const color50 = colorHandler!.getColor(50);
      const color100 = colorHandler!.getColor(100);

      // Verify exact color values with alpha interpolation
      expect(color0).toBe("#00000080");
      expect(color50).toBe("#777777BF");
      expect(color100).toBe("#FFFFFFFF");
    });
  });
});
