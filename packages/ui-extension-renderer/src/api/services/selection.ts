import type { Identifiers } from "../uiExtensionService";

/**
 * Selection service modes available by default to UI Extension nodes.
 */
export type SelectionMode = "REPLACE" | "ADD" | "REMOVE";

/**
 * Used both for the communication to and from the ui extension.
 */
export type SelectionParams = Identifiers & {
  mode: SelectionMode;
  selection: string[];
  error?: null;
};

export type ErroneousSelectionEventPayload = Identifiers & {
  mode: SelectionMode;
  selection: null;
  /**
   * Message of the error during a selection translation
   */
  error: string;
};

export type SelectionEventPayload =
  | SelectionParams
  | ErroneousSelectionEventPayload;
