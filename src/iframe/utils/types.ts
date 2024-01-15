import { UIExtensionPushEvents } from "../../serviceTypes";

export interface WrappedIframePushEvent<T> {
  type: string;
  payload: T;
}

export type IframeMessageEvent<T> = MessageEvent<
  WrappedIframePushEvent<UIExtensionPushEvents.PushEvent<T>>
>;
