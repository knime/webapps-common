export enum RenderingType {
  DEFAULT = "DEFAULT",
  REPORT = "REPORT",
  IMAGE = "IMAGE",
}

export type DefaultRenderingConfig = { type: RenderingType };

export type ImageRenderingConfig = {
  type: RenderingType;
  actionId: string; // communicate the generated image to the backend
};

export type ReportRenderingConfig = {
  type: RenderingType;
  canBeUsedInReport: boolean;
};

export type RenderingConfig =
  | DefaultRenderingConfig
  | ImageRenderingConfig
  | ReportRenderingConfig;
