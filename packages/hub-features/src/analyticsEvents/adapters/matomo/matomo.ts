/* eslint-disable @typescript-eslint/no-explicit-any */

import type { AnalyticsPayload } from "../../types";
import { eventID } from "../../utils/eventIds";
import type { Adapter } from "../types";

import type { PushArgs } from "./types";

const getTrackFn = () => {
  if (!(window as any)._paq) {
    (window as any)._paq = [];
  }

  return (window as any)._paq as { push: (args: PushArgs) => void };
};

const parseEventId = (event: AnalyticsPayload) => {
  const [category, action] = eventID(event.id).parse();

  return { category, action };
};

function sendEvent(event: AnalyticsPayload): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log("RECEIVED TRACKING EVENT", event);
    return;
  }

  try {
    const { category, action } = parseEventId(event);

    if (event.data) {
      getTrackFn().push([
        "trackEvent",
        category,
        action,
        JSON.stringify(event.data),
      ]);
    } else {
      getTrackFn().push(["trackEvent", category, action]);
    }
  } catch (error) {
    consola.error(error);
  }
}

export const matomoAdapter: Adapter = {
  init: (schemaVersion: string) => {
    consola.debug(
      "Initializing analytics adapter for schema version:",
      schemaVersion,
    );
    // eslint-disable-next-line no-magic-numbers
    getTrackFn().push(["enableHeartBeatTimer", 30]);
  },

  sendEvent,
};
