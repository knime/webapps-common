import type {
  AddPushEventListener,
  EventType,
  PushEventListenerCallback,
} from "@knime/ui-extension-renderer/api";
import type { IframeMessageEvent } from "@knime/ui-extension-renderer/iframe";

const iframePushEventId = "UIExtensionPushEvent";

const isUIExtensionPushEvent = (event: IframeMessageEvent) =>
  event.data.type === iframePushEventId;

/**
 * This {@link AddPushEventListener} implementation is used by client ui extension
 * implementations inside an iframe. The registered listeners are triggered
 * by an {@link IframeDispatchEvent} on the embedder side
 */
export class IframeAddEventListener implements AddPushEventListener {
  private contentWindow: Window;

  constructor(contentWindow: Window) {
    this.contentWindow = contentWindow;
  }

  addPushEventListener<T extends EventType>(
    eventType: T,
    callback: PushEventListenerCallback<T>,
  ): () => void {
    const handler = (messageEvent: IframeMessageEvent) => {
      if (!isUIExtensionPushEvent(messageEvent)) {
        return;
      }
      const event = messageEvent.data.payload;
      if (event.eventType !== eventType) {
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(event.payload as any);
    };

    this.contentWindow.addEventListener("message", handler);

    return () => this.contentWindow.removeEventListener("message", handler);
  }
}
