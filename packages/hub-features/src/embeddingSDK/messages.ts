/**
 * ----------- IMPORTANT NOTES ---------------
 * 1. These messages are considered API. So they **must** remain
 *    backwards compatible
 * 2. Instead of removal of properties from the embedding context payload,
 *    we must use deprecation notes that list which AP version last used the
 *    deprecated property
 * 3. The message variable name can change, but not it's value. This is because
 *    these values are used since AP browser embedding was first implemented, so
 *    they must be retained in order to preserve backwars compatibility
 */

export const MESSAGES = {
  /**
   * Message used to establish a handshake and setup
   * before waiting for embedding context transfer
   */
  AWAITING_EMBEDDING_CONTEXT: "KNIME_UI__AWAITING_CONNECTION_INFO",
  /**
   * Message that contains the embedding context information
   */
  EMBEDDING_CONTEXT: "KNIME_UI__CONNECTION_INFO",
  /**
   * Message used for when embedding failed
   */
  EMBEDDING_FAILED: "KNIME_UI__CONNECTION_FAIL",
  /**
   * Message to report user activity events
   */
  USER_ACTIVITY: "KNIME_UI__USER_ACTIVITY",
  /**
   * General purpose event to transfer data between host application and embedded
   * application.
   */
  GENERIC_EVENT: "KNIME_UI__GENERIC_EVENT",
} as const;
