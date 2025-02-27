import type {
  EventType,
  PushEvent,
  UIExtensionServiceAPILayer,
} from "../../api";

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
  | "showDataValueView"
  | "closeDataValueView"
> & {
  /**
   * @returns the respective deregistration method
   */
  registerPushEventService: (service: {
    dispatchPushEvent: <T extends EventType>(event: PushEvent<T>) => void;
  }) => () => void;

  callKnimeUiApi?: UIExtensionServiceAPILayer["callKnimeUiApi"];
};

export type { UIExtensionAPILayer };
