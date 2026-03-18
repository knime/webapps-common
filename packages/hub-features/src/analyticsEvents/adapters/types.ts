import type { AnalyticsPayload } from "../types";

export type Adapter = {
  /**
   * Function to initialize the adapter in any way that it needs
   * @param schemaVersion
   */
  init: (schemaVersion: string) => void;
  /**
   * Function to send the event according to the API the adapter is implementing
   * @param event
   */
  sendEvent: (event: AnalyticsPayload) => void;
};
