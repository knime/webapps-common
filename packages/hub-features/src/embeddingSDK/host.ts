/* eslint-disable @typescript-eslint/no-use-before-define */
import { MESSAGES } from "./messages";
import {
  type EmbeddingContext,
  type GenericEvent,
  type GenericEventHandlers,
  type UserActivityInfo,
} from "./types";
import { messageValidators } from "./util";

const logger = () => consola.withTag("Embedding SDK::HOST embedder");

/**
 * This function acts as a handshake to make sure the event with the
 * embedding context is only sent once the embedded application is ready to
 * receive it and not earlier. It also listens to possible embedding failure
 * from the child application
 */
export const init = (callbacks: {
  onReady: () => void;
  onError: (error: Error) => void;
}) => {
  function teardown() {
    window.removeEventListener("message", onMessage);
  }

  function onMessage(event: MessageEvent) {
    if (!messageValidators.isInitializationMessage(event)) {
      return;
    }

    if (event.data?.type === MESSAGES.AWAITING_EMBEDDING_CONTEXT) {
      logger().info("Got confirmation to send embedding context");
      callbacks.onReady();
      teardown();
    }

    if (event.data?.type === MESSAGES.EMBEDDING_FAILED) {
      logger().error("Received embedding failure message", {
        event: event.data,
      });
      callbacks.onError(event.data.error);
      teardown();
    }
  }

  window.addEventListener("message", onMessage);
  logger().info("Initialization done");
};

export const sendEmbeddingContext = (
  iframe: HTMLIFrameElement,
  targetOrigin: string,
  context: EmbeddingContext,
) => {
  logger().info("Sending embedding context", context);

  iframe.contentWindow?.postMessage(
    {
      type: MESSAGES.EMBEDDING_CONTEXT,
      payload: {
        // AP uses `url` instead of `wsConnectionUri` in older versions, so it needs
        // to be present to preserve backwards compatibility
        url: context.wsConnectionUri,
        wsConnectionUri: context.wsConnectionUri,

        restApiBaseUrl: context.restApiBaseUrl,
        userIdleTimeout: context.userIdleTimeout,
        sessionId: context.sessionId,
        jobId: context.jobId,
      } satisfies EmbeddingContext,
    },
    targetOrigin,
  );
};

/**
 * Sets up a listener to receive user activity events to detect idleness
 */
export const listenToActivityEvents = (callbacks: {
  onActivity: (event: UserActivityInfo) => void;
}) => {
  const onMessage = (event: MessageEvent) => {
    if (!messageValidators.isUserActivityMessage(event)) {
      return;
    }

    logger().info("Received user activity change event", {
      event: event.data,
    });
    callbacks.onActivity(event.data.payload);
  };

  window.addEventListener("message", onMessage);
  logger().info("Attaching user activity listener");

  return () => window.removeEventListener("message", onMessage);
};

/**
 * Sets up handlers for commands dispatched from the embedded guest application
 */
export const setupGenericEventHandlers = <K extends GenericEvent["kind"]>(
  handlers: GenericEventHandlers,
) => {
  const onMessage = (event: MessageEvent) => {
    if (!messageValidators.isGenericEvent<K>(event)) {
      return;
    }

    const genericEvent = event.data.payload;
    logger().info("Received GenericEvent", { event: event.data });

    const isCallable =
      Object.prototype.hasOwnProperty.call(handlers, genericEvent.kind) &&
      typeof handlers[genericEvent.kind] === "function";

    if (isCallable) {
      logger().trace("Calling provided handler", { event: event.data });
      handlers[genericEvent.kind]?.(genericEvent);
    }
  };

  window.addEventListener("message", onMessage);
  logger().info("Attaching listener for GenericEvents");

  return () => window.removeEventListener("message", onMessage);
};
