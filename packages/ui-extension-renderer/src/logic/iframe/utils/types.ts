import { type UIExtensionPushEvents } from "../../../types/serviceApiLayer";

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
