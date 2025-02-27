import type { EventType, PushEvent } from "../../../api";

export interface WrappedIframePushEvent<T, S> {
  type: S;
  payload: T;
}

export type IframeMessageEvent = MessageEvent<
  WrappedIframePushEvent<PushEvent<EventType>, "UIExtensionPushEvent">
>;
