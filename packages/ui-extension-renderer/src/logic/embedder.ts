export * from "./iframe/embedder";

import type {
  UIExtensionService,
  UIExtensionServiceAPILayer,
} from "../types/serviceApiLayer";
import { type UIExtensionPushEvents } from "../types/serviceApiLayer/pushEvents";

import { DefaultEventHandler } from "./pushEvents";

export const addDefaults = (
  apiLayer: UIExtensionServiceAPILayer,
): UIExtensionServiceAPILayer => ({
  callKnimeUiApi: () => Promise.resolve({ isSome: false }),
  ...apiLayer,
});

/**
 * exported for test purposes
 */
export const setUpCustomEmbedderService = <APILayer>(
  apiLayer: APILayer,
): UIExtensionPushEvents.DispatchPushEvent & {
  service: UIExtensionService<APILayer>;
} => {
  const pushEventHandler = new DefaultEventHandler();
  return {
    service: {
      ...apiLayer,
      addPushEventListener:
        pushEventHandler.addPushEventListener.bind(pushEventHandler),
    },
    dispatchPushEvent:
      pushEventHandler.dispatchPushEvent.bind(pushEventHandler),
  };
};

/**
 * Service used to communicate with KNIME's internal extensions which are not inside an iframe.
 */
export const setUpEmbedderService = (
  apiLayer: UIExtensionServiceAPILayer,
): UIExtensionPushEvents.DispatchPushEvent & {
  service: UIExtensionService;
} => {
  return setUpCustomEmbedderService(addDefaults(apiLayer));
};
