export enum RenderingType {
  DEFAULT = "DEFAULT",
  REPORT = "REPORT",
  IMAGE = "IMAGE",
}

export enum ImageFileFormat {
  SVG = "SVG",
  PNG = "PNG",
}

export interface RenderingConfig {
  type: RenderingType;
}

export interface DefaultRenderingConfig extends RenderingConfig {
  type: RenderingType.DEFAULT;
}

export interface ImageFileFormatRenderingConfig extends RenderingConfig {
  imageFileFormat: ImageFileFormat; // file format that the generated image should have
}

export interface ImageGenerationRenderingConfig
  extends ImageFileFormatRenderingConfig {
  type: RenderingType.IMAGE;
  actionId: string; // communicate the generated image to the backend
}

export interface ReportRenderingConfig extends ImageFileFormatRenderingConfig {
  type: RenderingType.REPORT;
  canBeUsedInReport: boolean;
}
