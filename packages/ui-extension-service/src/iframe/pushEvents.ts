import { UIExtensionPushEvents as Events } from "../types";

import { isWrappedEventOfType, toWrappedEventOfType } from "./utils/events";
import { IframeMessageEvent } from "./utils/types";

const iframePushEventId = "UIExtensionPushEvent";

const isUIExtensionPushEvent = (event: IframeMessageEvent) =>
  isWrappedEventOfType(event, iframePushEventId);

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

/**
 * This {@link AddPushEventListener} implementation is used by client ui extension
 * implementations inside an iframe. The registered listeners are triggered
 * by an {@link IframeDispatchEvent} on the embedder side
 */
export class IframeAddEventListener implements Events.AddPushEventListener {
  private contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  addPushEventListener<T extends Events.EventType>(
    eventType: T,
    callback: Events.PushEventListenerCallback<T>,
  ): () => void {
    const handler = (messageEvent: IframeMessageEvent) => {
      if (!isUIExtensionPushEvent(messageEvent)) {
        return;
      }
      const event = messageEvent.data.payload;
      if (event.eventType !== eventType) {
        return;
      }
      callback(event.payload);
    };

    this.contentWindow.addEventListener("message", handler);

    return () => this.contentWindow.removeEventListener("message", handler);
  }
}
