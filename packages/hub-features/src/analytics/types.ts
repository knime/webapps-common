import type { AnalyticsEventSchema } from "./schema/schema";

export const SEPARATOR = "::";
type Separator = typeof SEPARATOR;

type EventDefinitions = AnalyticsEventSchema["events"];

/**
 * Group names (top-level keys in `events`, e.g. "kai_prompted").
 */
type GroupName = keyof EventDefinitions;

/**
 * Event names in the flattened "group::event" form. This makes event calls
 * single keys using the `::` separator (for example "kai_prompted::kaiqa_button_prompt").
 */
export type EventNames = {
  [G in GroupName]: `${G}${Separator}${keyof EventDefinitions[G] & string}`;
}[GroupName];

export type Metadata = Omit<AnalyticsEventSchema, "events">;

export type Context = { jobId: string };

/**
 * Resolve the payload type for a flattened event name like
 * "group::eventKey". If the referenced payload is `null`, the args are
 * just the type; otherwise a payload must be provided.
 */
type PayloadFor<KN extends EventNames> =
  KN extends `${infer G}${Separator}${infer E}`
    ? G extends GroupName
      ? E extends keyof EventDefinitions[G]
        ? EventDefinitions[G][E]
        : never
      : never
    : never;

type EventArgs<K extends EventNames> =
  PayloadFor<K> extends null
    ? { id: K; payload?: never }
    : { id: K; payload: PayloadFor<K> };

export type AnalyticsPayload = {
  id: string;
  data: unknown;
};

export type CreateEventFn<TReturn = void> = <K extends EventNames>(
  args: EventArgs<K>,
) => TReturn;

export interface AnalyticsAdapter {
  /**
   * Function to send the event according to the API the adapter is implementing
   */
  sendEvent: (params: {
    idParser: (id: string) => { category: string; action: string };
    event: AnalyticsPayload;
    metadata: Metadata;
  }) => void;
}
