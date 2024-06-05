import type {
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
  | "onDirtyStateChange"
  | "onApplied"
  | "setControlsVisibility"
  | "sendAlert"
> & {
  /**
   * @returns the respective deregistration method
   */
  registerPushEventService: (service: {
    dispatchPushEvent: <T extends UIExtensionPushEvents.EventType>(
      event: UIExtensionPushEvents.PushEvent<T>,
    ) => void;
  }) => () => void;
};

export type { UIExtensionAPILayer };
