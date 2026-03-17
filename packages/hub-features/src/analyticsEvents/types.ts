import type { AnalyticsEvents } from "./schema/schema";

type AllEvents = AnalyticsEvents["events"];
export type AnalyticEventNames = keyof AllEvents;

export type Context = { jobId: string };
export type CreateEventFn = <K extends AnalyticEventNames>(
  type: K,
  ...args: AllEvents[K] extends null ? [] : [payload: AllEvents[K]]
) => {
  id: string;
  data: {
    job_id: Context["jobId"];
    event_id: string;
    timestamp: string;
    [key: string]: unknown;
  };
};
