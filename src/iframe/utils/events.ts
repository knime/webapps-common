import { IframeMessageEvent, WrappedIframePushEvent } from "./types";

export const isWrappedEventOfType = (
  event: IframeMessageEvent,
  type: string,
) => {
  return event.data.type === type;
};

export const toWrappedEventOfType = <T, S>(
  payload: T,
  type: S,
): WrappedIframePushEvent<T, S> => {
  return {
    type,
    payload,
  };
};
