import type {
  Alert,
  UIExtensionPushEvents,
  UIExtensionServiceAPILayer,
} from "@knime/ui-extension-service";

type UIExtensionAPILayer = Pick<
  UIExtensionServiceAPILayer,
  | "callNodeDataService"
  | "imageGenerated"
  | "setReportingContent"
  | "publishData"
  | "updateDataPointSelection"
  | "getResourceLocation"
  | "close"
  | "setSettingsWithCleanModelSettings"
  | "setDirtyModelSettings"
  | "onApplied"
> & {
  sendAlert: (alert: Alert, closeAlert?: () => void) => void;
  /**
   * @returns the respective deregistration method
   */
  registerPushEventService: (service: {
    dispatchPushEvent: <T extends UIExtensionPushEvents.Name>(
      event: UIExtensionPushEvents.PushEvent<T>,
    ) => void;
  }) => () => void;
};

export type { UIExtensionAPILayer };
