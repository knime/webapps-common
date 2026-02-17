/* eslint-disable @typescript-eslint/no-use-before-define */
import { promise as PromiseUtils } from "@knime/utils";

import { MESSAGES } from "./messages";
import {
  type EmbeddingContext,
  type GenericEvent,
  type UserActivityInfo,
} from "./types";

let __embeddingContext: Readonly<EmbeddingContext>;
const logger = () => consola.withTag("Embedding SDK::GUEST application");

/**
 * Manually set the Embedding context. Use with caution as this should be done
 * automatically out-of-the-box. It's mostly exposed to be helpful for dev setups
 */
export const setContext = (value: EmbeddingContext) => {
  if (__embeddingContext) {
    logger().warn("Cannot set context, it is already set");
    return;
  }

  __embeddingContext = Object.freeze(value);
};

export const getContext = () => {
  if (!__embeddingContext) {
    logger().warn("Embedding:: Context was accessed before it was set.");
    return undefined;
  }

  return __embeddingContext;
};

/**
 * Only relevant for tests
 */
export const clearContext = () => {
  if (import.meta.env.PROD) {
    return;
  }

  // @ts-expect-error should not be called in prod
  __embeddingContext = undefined;
};

type EmbeddingContextValidator = (
  context: EmbeddingContext,
) => { valid: true; error: null } | { valid: false; error: string };
const defaultvalidator: EmbeddingContextValidator = () => ({
  valid: true,
  error: null,
});

const PARENT_ORIGIN = "*";

/**
 * Wait for host application to send a message containing the embedding context
 */
export const waitForContext = (
  validator: EmbeddingContextValidator = defaultvalidator,
): Promise<EmbeddingContext> => {
  const { promise, reject, resolve } =
    PromiseUtils.createUnwrappedPromise<EmbeddingContext>();

  function teardown() {
    window.removeEventListener("message", onMessage);
  }

  function onMessage(event: MessageEvent) {
    if (event.data.type !== MESSAGES.EMBEDDING_CONTEXT) {
      return;
    }

    const { data } = event as MessageEvent<{
      type: string;
      payload: EmbeddingContext;
    }>;

    const validation = validator(data.payload);
    if (!validation.valid) {
      logger().fatal("Incorrect embedding context payload", {
        data,
        error: validation.error,
      });
      reject(new Error(validation.error));
      teardown();
      return;
    }

    logger().info("Received embedding context message", data);

    setContext(data.payload);
    resolve(data.payload);
    teardown();
  }

  window.addEventListener("message", onMessage, false);

  // send message to parent after postmessage listener has been set-up
  logger().info("Awaiting to receive embedding context");
  window.parent.postMessage(
    { type: MESSAGES.AWAITING_EMBEDDING_CONTEXT },
    PARENT_ORIGIN,
  );

  return promise;
};

export const sendEmbeddingFailureMessage = (error: unknown) => {
  window.parent.postMessage(
    { type: MESSAGES.EMBEDDING_FAILED, error },
    PARENT_ORIGIN,
  );
};

export const dispatchGenericEventToHost = (event: GenericEvent) => {
  logger().info("Sending GenericEvent", { event });

  window.parent.postMessage(
    { type: MESSAGES.GENERIC_EVENT, payload: event },
    PARENT_ORIGIN,
  );
};

export const notifyActivityChange = (userActivityInfo: UserActivityInfo) => {
  logger().info("Sending user activity info", { payload: userActivityInfo });

  window.parent.postMessage(
    { type: MESSAGES.USER_ACTIVITY, payload: userActivityInfo },
    PARENT_ORIGIN,
  );
};
