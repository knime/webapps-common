export interface DefaultRenderingConfig {
  type: "DEFAULT";
}

export interface ImageFormatRenderingConfig {
  imageFormat: "SVG" | "PNG"; // file format that the generated image should have
}

export interface ImageGenerationRenderingConfig
  extends ImageFormatRenderingConfig {
  type: "IMAGE";
  actionId: string; // communicate the generated image to the backend
}

export interface ReportRenderingConfig extends ImageFormatRenderingConfig {
  type: "REPORT";
  canBeUsedInReport: boolean;
}

export type RenderingConfig =
  | DefaultRenderingConfig
  | ImageGenerationRenderingConfig
  | ReportRenderingConfig;
