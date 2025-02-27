import type { DispatchPushEvent, EventType, PushEvent } from "../../api";

import { toWrappedEventOfType } from "./utils/events";

const iframePushEventId = "UIExtensionPushEvent";

const toUIExtensionPushEventMessage = <T extends EventType>(
  event: PushEvent<T>,
) => toWrappedEventOfType(event, iframePushEventId);

/**
 * This {@link DispatchPushEvent} implementation is used by
 * the embedder side of an iframe ui extension to dispatch events
 * to any listeners registered by an {@link IframeAddEventListener} inside that iframe
 */
export class IframeDispatchEvent implements DispatchPushEvent {
  private readonly contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  dispatchPushEvent<T extends EventType>(event: PushEvent<T>) {
    this.contentWindow.postMessage(toUIExtensionPushEventMessage(event), "*");
  }
}
