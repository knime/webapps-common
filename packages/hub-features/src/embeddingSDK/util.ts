import { MESSAGES } from "./messages";
import { type GenericEvent, type GenericEventByKind } from "./types";

export const messageValidators = {
  isInitializationMessage: (event: MessageEvent) =>
    [MESSAGES.AWAITING_EMBEDDING_CONTEXT, MESSAGES.EMBEDDING_FAILED].includes(
      event.data?.type,
    ),

  isUserActivityMessage: (event: MessageEvent) =>
    MESSAGES.USER_ACTIVITY === event.data?.type,

  isGenericEvent: <K extends GenericEvent["kind"]>(
    event: MessageEvent,
  ): event is MessageEvent<{
    type: typeof MESSAGES.GENERIC_EVENT;
    payload: GenericEventByKind<K>;
  }> => event.data?.type === MESSAGES.GENERIC_EVENT,
};
