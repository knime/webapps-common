export * from "./iframe/embedder";

import { DefaultEventHandler } from "./pushEvents";
import type {
  CustomUIExtensionService,
  UIExtensionAPILayer,
  UIExtensionPushEvents,
  UIExtensionService,
} from "./serviceTypes";

/**
 * exported for test purposes
 */
export const setUpCustomEmbedderService = <APILayer>(
  apiLayer: APILayer,
): UIExtensionPushEvents.DispatchPushEvent & {
  service: CustomUIExtensionService<APILayer>;
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
 * @param apiLayer
 * @returns
 */
export const setUpEmbedderService = (
  apiLayer: UIExtensionAPILayer,
): UIExtensionPushEvents.DispatchPushEvent & {
  service: UIExtensionService;
} => {
  return setUpCustomEmbedderService(apiLayer);
};
