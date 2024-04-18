export interface ValueReference {
  /**
   * The sequence of schema paths (multiple in case of array layout elements) of the setting
   */
  scopes: string[]; // TODO also string array in backend
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
export interface PathAndValue {
  path: string[]; // TODO also string array in backend
  id: null;
  value: unknown;
}

export interface IdAndValue {
  path: null;
  id: string;
  value: unknown;
}

export type UpdateResult = PathAndValue | IdAndValue;
