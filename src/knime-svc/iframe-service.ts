import type {
  CreateUIExtensionIframeService,
  GetConfig,
  UIExtensionAPILayer,
  UIExtensionEvents,
  UIExtensionMessageExchange,
} from "./types";

/**
 * Sets up the necessary handler on the window to receive
 * message requests (See: service-proxy)
 *
 * A message received will be processed here by calling the appropriate
 * method on the API layer, and then the response will be forwarded back
 * via postmessage using the message exchange's `Response` format
 * @param iframe
 * @param apiLayer
 * @returns
 */
const setupStandardRequestHandler = (
  iframe: HTMLIFrameElement,
  apiLayer: UIExtensionAPILayer & GetConfig,
) => {
  const isUIExtensionMessageExchangeRequest = (
    event: MessageEvent<UIExtensionMessageExchange.GenericEvent>,
  ): event is MessageEvent<UIExtensionMessageExchange.Request> => {
    return event.data.type === "UIExtensionRequest";
  };

  // handles events received in parent
  const messageHandler = async (event: MessageEvent) => {
    if (isUIExtensionMessageExchangeRequest(event)) {
      const { method, params } = event.data.payload;
      // @ts-expect-error
      const response = await apiLayer[method](...params);

      const message: UIExtensionMessageExchange.Response = {
        requestId: event.data.requestId,
        type: "UIExtensionResponse",
        payload: response,
      };

      iframe.contentWindow?.postMessage(message);
    }
  };

  window.addEventListener("message", messageHandler);

  return () => window.removeEventListener("message", messageHandler);
};

/**
 * Service used to communicate with extensions by external contributors
 * @param messageReceiver
 * @returns
 */
export const useIframeEventHandling = (
  //  eslint-disable-next-line no-undef
  messageReceiver?: Window & typeof globalThis, // TODO globalThis is not defined here
) => {
  const pushEventListeners: Array<(e: any) => void> = [];

  let messageReceiverRef: typeof messageReceiver = messageReceiver;

  const addPushEventListener = (
    eventName: string,
    callback: <T>(event: UIExtensionEvents.Event<T>) => void,
  ) => {
    const handler = (event: MessageEvent<UIExtensionEvents.PushEvent<any>>) => {
      if (event.data.type !== "UIExtensionPushEvent") {
        return;
      }

      if (event.data.payload.name !== eventName) {
        return;
      }

      callback(event.data.payload);
    };

    pushEventListeners.push(handler);

    if (messageReceiverRef) {
      messageReceiverRef.addEventListener("message", handler);
    }

    const teardown = () => {
      if (messageReceiverRef) {
        messageReceiverRef.removeEventListener("message", handler);
      }
    };

    return teardown;
  };

  // pushes events to the child iframe
  const dispatchPushEvent = <T>(event: UIExtensionEvents.Event<T>) => {
    const message: UIExtensionEvents.PushEvent<T> = {
      type: "UIExtensionPushEvent",
      payload: event,
    };

    if (messageReceiverRef) {
      messageReceiverRef.postMessage(message);
    }
  };

  const setMessageReceiver = (_value: typeof messageReceiver) => {
    if (!_value) {
      return;
    }

    messageReceiverRef = _value;

    pushEventListeners.forEach((_handler) => {
      messageReceiverRef!.addEventListener("message", _handler);
    });
  };

  return {
    setMessageReceiver,

    dispatchPushEvent,
    addPushEventListener,
  };
};

export const useIframeService = (
  apiLayer: UIExtensionAPILayer,
): CreateUIExtensionIframeService => {
  return <T>(config: T) => {
    const getConfig = () => config;

    const { addPushEventListener, setMessageReceiver, dispatchPushEvent } =
      useIframeEventHandling();

    return {
      ...apiLayer,

      setIframe: (iframe: HTMLIFrameElement) => {
        setupStandardRequestHandler(iframe, { ...apiLayer, getConfig });
        // @ts-expect-error - TODO: Type this better
        setMessageReceiver(iframe.contentWindow);
      },

      getConfig,

      dispatchPushEvent,
      addPushEventListener,
    };
  };
};
