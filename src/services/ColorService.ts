import { KnimeService } from './KnimeService';
import { ColorModel, ColorModelType, NumericColorModel } from '../types/ColorModel';
import convert from 'color-convert';
import { AlertTypes } from 'src';

// TODO: UIEXT-858 Provide this default color via color model
const lightGray = '#D3D3D3';


abstract class AbstractColorHandler<Model> {
    private colorModel: Model;
    
    constructor(model: Model) {
        this.colorModel = model;
    }
    
    public abstract getColor(value: string | number): string;
    
    public getColorModel(): Model {
        return this.colorModel;
    }
}

const interpolate = (min: number, max: number, ratio: number) => {
    const interpolated = Math.round(min + (max - min) * ratio);
    const minColorValue = 0;
    const maxColorValue = 255;
    if (interpolated < minColorValue) {
        return minColorValue;
    }
    if (interpolated > maxColorValue) {
        return maxColorValue;
    }
    return interpolated;
};

export class NumericColorHandler extends AbstractColorHandler<NumericColorModel> {
    rgbMin: [number, number, number];
    rgbMax: [number, number, number];
    getRatio: (value: number) => number;

    constructor(model: NumericColorModel) {
        super(model);
        const { minColor, maxColor, minValue, maxValue } = model;
        this.rgbMin = convert.hex.rgb(minColor);
        this.rgbMax = convert.hex.rgb(maxColor);
        this.getRatio = (value) => (value - minValue) / (maxValue - minValue);
    }

    public getColor(value: number): string {
        const ratio = this.getRatio(value);

        const interpolated = Array.from(
            { length: 3 },
            (_v, i) => interpolate(this.rgbMin[i], this.rgbMax[i], ratio)
        ) as [number, number, number];

        return `#${convert.rgb.hex(interpolated)}`;
    }
}

export class NominalColorHandler extends AbstractColorHandler<Record<string, string>> {
    public getColor(value: string): string {
        return this.getColorModel()[value] || lightGray;
    }
}

export type ColorHandler = NumericColorHandler | NominalColorHandler;

/**
 * A utility class to receive a color callback created by the color model provided by a
 * UI Extension node.
 */
export class ColorService {
    /**
     * Mapping from column name to attached color model given by the extension config.
     */
    private colorModels: Record<string, ColorModel> | undefined;
    private knimeService: KnimeService;

    /**
     * @param {KnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
    constructor(knimeService: KnimeService) {
        this.colorModels = knimeService.extensionConfig?.colorModels;
        if (!this.colorModels) {
            throw new Error(`No color models present in the given extension config.`);
        }
        this.knimeService = knimeService;
    }

    public getColorHandler(columnName: string) {
        if (columnName in this.colorModels) {
            const colorModel = this.colorModels[columnName];
            if (colorModel.type === ColorModelType.NUMERIC) {
                return new NumericColorHandler(colorModel.model);
            } else {
                return new NominalColorHandler(colorModel.model);
            }
        }
        this.knimeService.sendWarning(this.knimeService.createAlert(
            { type: AlertTypes.WARN, message: `No color handler found for the given column name "${columnName}".` }
        ));
        return null;
    }
}

