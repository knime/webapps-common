import type {
  AnalyticsAdapter,
  AnalyticsPayload,
  Context,
  CreateEventFn,
  Metadata,
} from "./types";
import { eventID } from "./utils/eventIds";
import { toSnakeCaseDeep } from "./utils/toSnakeCaseDeep";

const METADATA: Metadata = Object.freeze({
  version: "v1.0",
});

export const analyticsEvents = Object.freeze({
  METADATA,
  /**
   * This function creates an event builder, which lets you construct correct and strongly-typed
   * event payloads according to the current schema used by this package
   * @param context
   * @returns
   */
  eventBuilder: (context: Context) => {
    const newEvent: CreateEventFn<AnalyticsPayload> = ({
      id: eventId,
      payload: eventData,
    }) => {
      // runtime check just in case - shouldn't be needed due to TS
      if (!eventID(eventId).isValid()) {
        throw new Error(`Implementation error: Invalid event id: ${eventId}`);
      }

      const uniqueEventId = crypto.randomUUID();

      const data = (() => {
        if (!eventData) {
          return undefined;
        }

        return toSnakeCaseDeep((eventData as unknown) ?? {});
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

    return { newEvent };
  },
  /**
   * This function creates an event sender which will use an internal implementation of an adapter
   * to forward the event's data to an external third-party provider
   * @returns
   */
  eventSender: (adapter: AnalyticsAdapter) => {
    const send = (event: AnalyticsPayload) => {
      adapter.sendEvent({
        event,
        idParser: eventID(event.id).parse,
        metadata: METADATA,
      });
    };

    return { send };
  },
});
