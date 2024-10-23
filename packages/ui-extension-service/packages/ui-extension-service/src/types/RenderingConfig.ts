export enum RenderingType {
  DEFAULT = "DEFAULT",
  REPORT = "REPORT",
  IMAGE = "IMAGE",
}

export enum ImageFormat {
  SVG = "SVG",
  PNG = "PNG",
}

export interface RenderingConfig {
  type: RenderingType;
}

export interface DefaultRenderingConfig extends RenderingConfig {
  type: RenderingType.DEFAULT;
}

export interface ImageFormatRenderingConfig extends RenderingConfig {
  imageFormat: ImageFormat; // file format that the generated image should have
}

export interface ImageGenerationRenderingConfig
  extends ImageFormatRenderingConfig {
  type: RenderingType.IMAGE;
  actionId: string; // communicate the generated image to the backend
}

export interface ReportRenderingConfig extends ImageFormatRenderingConfig {
  type: RenderingType.REPORT;
  canBeUsedInReport: boolean;
}
