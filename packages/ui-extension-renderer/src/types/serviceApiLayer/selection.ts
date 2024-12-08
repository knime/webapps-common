/**
 * Selection service modes available by default to UI Extension nodes.
 */
export type SelectionMode = "REPLACE" | "ADD" | "REMOVE";

/**
 * Used both for the communication to and from the ui extension.
 */
export interface SelectionParams {
  mode: SelectionMode;
  selection: string[];
}

export interface ErroneousSelectionEventPayload {
  mode: null;
  /**
   * Message of the error during a selection translation
   */
  error: string;
}

export type SelectionEventPayload =
  | SelectionParams
  | ErroneousSelectionEventPayload;
