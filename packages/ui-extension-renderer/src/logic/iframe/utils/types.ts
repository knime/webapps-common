import { type UIExtensionPushEvents } from "../../../api";

export interface WrappedIframePushEvent<T, S> {
  type: S;
  payload: T;
}

export type IframeMessageEvent = MessageEvent<
  WrappedIframePushEvent<
    UIExtensionPushEvents.PushEvent<UIExtensionPushEvents.EventType>,
    "UIExtensionPushEvent"
  >
>;
