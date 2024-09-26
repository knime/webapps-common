export interface ValueReference {
  /**
   * The sequence of schema paths (multiple in case of array layout elements) of the setting
   */
  scopes: string[];
  /**
   * A unique identifyer
   */
  id: string;
}

export interface Trigger {
  id: string;
  scopes: undefined;
  triggerInitially?: true;
}

export interface Update {
  /**
   * The dependencies that the frontend needs to provide when requesting an update from the backend
   */
  dependencies: ValueReference[];
  /**
   * The trigger of this update
   */
  trigger:
    | Trigger
    | (ValueReference & {
        triggerInitially: undefined;
      });
}

export type IndicesValuePairs = { indices: number[]; value: unknown }[]; // synchronous computeBeforeOpenDialog results
export type IndexIdsValuePairs = { indices: string[]; value: unknown }[]; // asynchronous results
export type Pairs = IndicesValuePairs | IndexIdsValuePairs;

// value updates
export interface ScopesAndValue {
  scopes: string[];
  id: null;
  values: Pairs;
}

// ui state updates
export interface IdAndValue {
  scopes: null;
  id: string;
  values: Pairs;
}

export type UpdateResult = ScopesAndValue | IdAndValue;
