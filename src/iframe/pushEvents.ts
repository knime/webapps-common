import { UIExtensionPushEvents } from "../serviceTypes";
import { isWrappedEventOfType, toWrappedEventOfType } from "./utils/events";
import { IframeMessageEvent } from "./utils/types";

const iframePushEventId = "UIExtensionPushEvent";

const isUIExtensionPushEvent = (event: IframeMessageEvent<any>) =>
  isWrappedEventOfType(event, iframePushEventId);

const toUIExtensionPushEventMessage = <T>(
  event: UIExtensionPushEvents.PushEvent<T>,
) => toWrappedEventOfType(event, iframePushEventId);

/**
 * This {@link DispatchPushEvent} implementation is used by
 * the embedder side of an iframe ui extension to dispatch events
 * to any listeners registered by an {@link IframeAddEventListener} inside that iframe
 */
export class IframeDispatchEvent
  implements UIExtensionPushEvents.DispatchPushEvent
{
  private contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  dispatchPushEvent<T>(event: UIExtensionPushEvents.PushEvent<T>) {
    this.contentWindow.postMessage(toUIExtensionPushEventMessage(event), "*");
  }
}

/**
 * This {@link AddPushEventListener} implementation is used by client ui extension
 * implementations inside an iframe. The registered listeners are triggered
 * by an {@link IframeDispatchEvent} on the embedder side
 */
export class IframeAddEventListener
  implements UIExtensionPushEvents.AddPushEventListener
{
  private contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  addPushEventListener<T>(
    eventName: string,
    callback: UIExtensionPushEvents.PushEventListenerCallback<T>,
  ): () => void {
    const handler = (messageEvent: IframeMessageEvent<any>) => {
      if (!isUIExtensionPushEvent(messageEvent)) {
        return;
      }
      const event = messageEvent.data.payload;
      if (event.name !== eventName) {
        return;
      }
      callback(event.payload);
    };

    this.contentWindow.addEventListener("message", handler);

    return () => this.contentWindow.removeEventListener("message", handler);
  }
}
