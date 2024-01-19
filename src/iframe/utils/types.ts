import { UIExtensionPushEvents } from "../../types";

export interface WrappedIframePushEvent<T, S> {
  type: S;
  payload: T;
}

export type IframeMessageEvent = MessageEvent<
  WrappedIframePushEvent<
    UIExtensionPushEvents.PushEvent<UIExtensionPushEvents.Name>,
    "UIExtensionPushEvent"
  >
>;
