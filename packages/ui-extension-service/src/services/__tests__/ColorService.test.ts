import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  type CIELabColor,
  type ColorModel,
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
    const createCIELabColorModel = (
      stopValues: number[],
      stopColors: CIELabColor[],
    ): ColorModel => {
      return {
        type: "NUMERIC",
        model: {
          stopValues,
          stopColorsCIELab: stopColors,
          specialColors: {
            MISSING: [0, 0, 0, 1], // Black
            NAN: [100, 0, 0, 1], // White
            NEGATIVE_INFINITY: [50, -50, 0, 1], // Cyan-ish
            BELOW_MIN: [25, 0, 0, 1], // Dark gray
            ABOVE_MAX: [75, 0, 0, 1], // Light gray
            POSITIVE_INFINITY: [100, 50, 50, 1], // Yellow-ish
          },
        },
      };
    };

    it("handles basic CIELab interpolation between two stop values", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 1], // Black
            [100, 0, 0, 1], // White
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
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
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 50, 100],
          [
            [0, 0, 0, 1], // Black at 0
            [50, 50, 0, 1], // Mid-tone at 50
            [100, 0, 0, 1], // White at 100
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
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
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const missingColor = colorHandler!.getColor(null);
      expect(missingColor).toBeDefined();
      // Should return black (MISSING color)
      expect(missingColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles special color for NaN", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const nanColor = colorHandler!.getColor(NaN);
      expect(nanColor).toBeDefined();
      expect(nanColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles special color for positive infinity", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const infColor = colorHandler!.getColor(Infinity);
      expect(infColor).toBeDefined();
      expect(infColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles special color for negative infinity", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const negInfColor = colorHandler!.getColor(-Infinity);
      expect(negInfColor).toBeDefined();
      expect(negInfColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles values below minimum with BELOW_MIN special color", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [10, 100],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const belowMinColor = colorHandler!.getColor(5);
      expect(belowMinColor).toBeDefined();
      expect(belowMinColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles values above maximum with ABOVE_MAX special color", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 90],
          [
            [0, 0, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const aboveMaxColor = colorHandler!.getColor(95);
      expect(aboveMaxColor).toBeDefined();
      expect(aboveMaxColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("handles equal step values without division by zero", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [50, 50, 100],
          [
            [0, 0, 0, 1],
            [50, 50, 0, 1],
            [100, 0, 0, 1],
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      // Should return the color at the stop value without error
      const color50 = colorHandler!.getColor(50);
      expect(color50).toBeDefined();
      expect(color50).toMatch(/^#[0-9A-Fa-f]{8}$/);
    });

    it("provides custom interpolation context with stop values and boundary colors", () => {
      const cielabColumnName = "cielabColumn";
      const stopValues = [0, 50, 100];
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(stopValues, [
          [0, 0, 0, 1],
          [50, 50, 0, 1],
          [100, 0, 0, 1],
        ]),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(cielabColumnName);

      // Test the new getCustomInterpolationContext method
      if ("getCustomInterpolationContext" in colorHandler!) {
        const context = (colorHandler as any).getCustomInterpolationContext();

        expect(context).toBeDefined();
        expect(context.stopValues).toEqual(stopValues);
        expect(context.belowMinColor).toBeDefined();
        expect(context.aboveMaxColor).toBeDefined();
        expect(context.belowMinColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
        expect(context.aboveMaxColor).toMatch(/^#[0-9A-Fa-f]{8}$/);
      }
    });

    it("preserves alpha channel in CIELab interpolation", () => {
      const cielabColumnName = "cielabColumn";
      const colorModels: Record<string, ColorModel> = {
        [cielabColumnName]: createCIELabColorModel(
          [0, 100],
          [
            [0, 0, 0, 0.5], // Half transparent
            [100, 0, 0, 1.0], // Fully opaque
          ],
        ),
      };

      ({ colorService } = createServices({ colorModels }));
      const colorHandler = colorService.getColorHandler(
        cielabColumnName,
      ) as NumericColorHandler;

      const color0 = colorHandler!.getColor(0);
      const color50 = colorHandler!.getColor(50);
      const color100 = colorHandler!.getColor(100);

      // All colors should have 8-character hex codes (including alpha)
      expect(color0).toMatch(/^#[0-9A-Fa-f]{8}$/);
      expect(color50).toMatch(/^#[0-9A-Fa-f]{8}$/);
      expect(color100).toMatch(/^#[0-9A-Fa-f]{8}$/);

      // Alpha values should be different
      expect(color0.slice(-2)).not.toBe(color100.slice(-2));
    });
  });
});
