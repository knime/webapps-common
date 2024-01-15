import { IframeMessageEvent, WrappedIframePushEvent } from "./types";

export const isWrappedEventOfType = (
  event: IframeMessageEvent<unknown>,
  type: string,
) => {
  return event.data.type === type;
};

export const toWrappedEventOfType = <T>(
  payload: T,
  type: string,
): WrappedIframePushEvent<T> => {
  return {
    type,
    payload,
  };
};
