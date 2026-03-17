import type { AnalyticsEvents } from "./schema/schema";
import { toSnakeCaseDeep } from "./toSnakeCaseDeep";
import type { Context, CreateEventFn } from "./types";

const METADATA: Omit<AnalyticsEvents, "events"> = Object.freeze({
  version: "v1",
});

export const setupAnalyticsEvents = (context: Context) => {
  /**
   * Creates the event object from the given id and payload
   */
  const createEvent: CreateEventFn = (eventId, ...eventData) => {
    const uniqueEventId = crypto.randomUUID();

    const data = (() => {
      if (!eventData.at(0)) {
        return undefined;
      }

      return toSnakeCaseDeep(eventData.at(0) ?? {});
    })();

    const event = {
      id: `editor_${eventId}`,
      data: {
        ...data,
        // eslint-disable-next-line camelcase
        job_id: context.jobId,
        // eslint-disable-next-line camelcase
        event_id: uniqueEventId,
        timestamp: new Date().toISOString(),
      },
    };

    return event;
  };

  return { analytics: { createEvent, getMetadata: () => METADATA } };
};
