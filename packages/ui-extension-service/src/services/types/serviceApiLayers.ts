import type {
  ColorModel,
  ExtensionType,
  Identifiers,
  RenderingConfig,
  UIExtensionServiceAPILayer,
} from "@knime/ui-extension-renderer/api";

export type AlertingServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "sendAlert"
>;

type ColorServiceExtensionConfig = {
  colorModels?: Record<string, ColorModel>;
  columnNamesColorModel?: ColorModel;
};

export type ColorServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "sendAlert"
> & {
  getConfig: () => ColorServiceExtensionConfig;
};

type DialogServiceExtensionConfig = Identifiers & {
  hasNodeView: boolean;
  writeProtected?: boolean;
  startEnlarged?: boolean;
};

export type DialogServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "onApplied" | "onDirtyStateChange" | "setControlsVisibility"
> & {
  getConfig: () => DialogServiceExtensionConfig;
};

export type ImageGenerationServiceExtensionConfig = {
  renderingConfig?: RenderingConfig;
};

export type ImageGenerationServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "imageGenerated"
> & { getConfig: () => ImageGenerationServiceExtensionConfig };

type JsonDataServiceExtensionConfig = Identifiers & {
  extensionType: ExtensionType;
  initialData?: any;
};

export type JsonDataServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "callNodeDataService" | "sendAlert"
> & { getConfig: () => JsonDataServiceExtensionConfig };

type SharedDataServiceExtensionConfig = {
  initialSharedData?: any;
};

export type SharedDataServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "publishData"
> & { getConfig: () => SharedDataServiceExtensionConfig };

export type ReportingServiceExtensionConfig = {
  renderingConfig?: RenderingConfig;
};

export type ReportingServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "setReportingContent"
> & { getConfig: () => ReportingServiceExtensionConfig };

export type ResourceServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "getResourceLocation"
> & { getConfig: () => object };

type SelectionServiceExtensionConfig = Identifiers & {
  initialData?: any;
  initialSelection?: any;
};

export type SelectionServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "updateDataPointSelection" | "sendAlert"
> & { getConfig: () => SelectionServiceExtensionConfig };

export type DataValueViewAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "showDataValueView" | "closeDataValueView"
> & { getConfig: () => object };
