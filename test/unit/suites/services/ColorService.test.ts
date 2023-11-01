/* eslint-disable no-magic-numbers */
import { KnimeService } from "src/services/KnimeService";
import {
  ColorService,
  NominalColorHandler,
  NumericColorHandler,
} from "src/services/ColorService";
import { ColorModelType } from "src/types/ColorModel";
import { extensionConfig } from "test/mocks";

const createServices = ({ colorModels = {}, columnNamesColorModel = null }) => {
  const config = { ...extensionConfig, colorModels, columnNamesColorModel };
  const knimeService = new KnimeService(config);
  knimeService.sendWarning = jest.fn();
  const colorService = new ColorService(knimeService);

  return { config, knimeService, colorService };
};

describe("ColorService", () => {
  const numericColumnName = "nominalColumn";
  const nominalColumnName = "numericColumn";

  let colorService: ColorService, knimeService: KnimeService;

  const colorModels = {
    [numericColumnName]: {
      type: ColorModelType.NUMERIC as const,
      model: {
        minColor: "#0000FF",
        maxColor: "#FF0000",
        minValue: 0,
        maxValue: 100,
      },
    },
    [nominalColumnName]: {
      type: ColorModelType.NOMINAL as const,
      model: {
        red: "#FF0000",
        green: "#00FF00",
        blue: "#0000FF",
      },
    },
  };

  beforeEach(() => {
    ({ knimeService, colorService } = createServices({ colorModels }));
  });

  const defaultColor = "#D3D3D3";

  describe("getColorCallback", () => {
    it("returns null and sets a warning if the column does not have a color handler", () => {
      expect(colorService.getColorHandler("foo")).toBeNull();
      expect(knimeService.sendWarning).toHaveBeenCalled();
    });

    it("does not set a warning if suppressed", () => {
      colorService.getColorHandler("foo", true);
      expect(knimeService.sendWarning).not.toHaveBeenCalled();
    });

    it("returns a function for nominal color model", () => {
      const colorHandler = colorService.getColorHandler(
        nominalColumnName,
      ) as NominalColorHandler;

      expect(colorHandler.getColor("red")).toBe("#FF0000");
      expect(colorHandler.getColor("green")).toBe("#00FF00");
      expect(colorHandler.getColor("blue")).toBe("#0000FF");
      expect(colorHandler.getColor("other")).toBe(defaultColor);
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
      const columnNamesColorModel = {
        type: ColorModelType.NOMINAL as const,
        model: {
          column1: "#FF0000",
          column2: "#00FF00",
          column3: "#0000FF",
        },
      };
      ({ knimeService, colorService } = createServices({
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
      ({ knimeService, colorService } = createServices({
        columnNamesColorModel: colorModels[numericColumnName],
      }));

      expect(() => colorService.getColumnNamesColorHandler()).toThrowError();
    });
  });
});
