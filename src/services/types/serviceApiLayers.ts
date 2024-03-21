import {
  AlertConfig,
  ExtensionTypes,
  Identifiers,
  UIExtensionServiceAPILayer,
} from "src/types";
import { ColorModel } from "src/types/ColorModel";

export type AlertingServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "sendAlert"
> & {
  getConfig: () => AlertConfig;
};

type ColorServiceExtensionConfig = AlertConfig & {
  colorModels?: Record<string, ColorModel>;
  columnNamesColorModel?: ColorModel;
};

export type ColorServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "sendAlert"
> & {
  getConfig: () => ColorServiceExtensionConfig;
};

type DialogServiceExtensionConfig = {
  hasNodeView: boolean;
  writeProtected?: boolean;
};

export type DialogServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "onApplied" | "onDirtyStateChange" | "setControlsVisibility"
> & {
  getConfig: () => DialogServiceExtensionConfig;
};

type ImageGenerationServiceExtensionConfig = {
  generatedImageActionId?: string | null;
};

export type ImageGenerationServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "imageGenerated"
> & { getConfig: () => ImageGenerationServiceExtensionConfig };

type JsonDataServiceExtensionConfig = AlertConfig &
  Identifiers & {
    extensionType: ExtensionTypes;
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

type ReportingServiceExtensionConfig = {
  generatedImageActionId?: string | null;
};

export type ReportingServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "setReportingContent"
> & { getConfig: () => ReportingServiceExtensionConfig };

export type ResourceServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "getResourceLocation"
> & { getConfig: () => {} };

type SelectionServiceExtensionConfig = Identifiers & {
  initialData?: any;
  initialSelection?: any;
};

export type SelectionServiceAPILayer = Pick<
  UIExtensionServiceAPILayer,
  "updateDataPointSelection"
> & { getConfig: () => SelectionServiceExtensionConfig };
