export interface Update {
  /**
   * The schema paths to the settings triggering an update
   */
  dependencies: string[];
  /**
   * An id to the backend handler that contains the update logic
   */
  updateHandler: string;
}

export interface PathAndValue {
  path: string;
  value: unknown;
}
