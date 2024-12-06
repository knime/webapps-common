import { type UIExtensionPushEvents as Events } from "../../types/serviceApiLayer";

import { toWrappedEventOfType } from "./utils/events";

const iframePushEventId = "UIExtensionPushEvent";

const toUIExtensionPushEventMessage = <T extends Events.EventType>(
  event: Events.PushEvent<T>,
) => toWrappedEventOfType(event, iframePushEventId);

/**
 * This {@link DispatchPushEvent} implementation is used by
 * the embedder side of an iframe ui extension to dispatch events
 * to any listeners registered by an {@link IframeAddEventListener} inside that iframe
 */
export class IframeDispatchEvent implements Events.DispatchPushEvent {
  private contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  dispatchPushEvent<T extends Events.EventType>(event: Events.PushEvent<T>) {
    this.contentWindow.postMessage(toUIExtensionPushEventMessage(event), "*");
  }
}
