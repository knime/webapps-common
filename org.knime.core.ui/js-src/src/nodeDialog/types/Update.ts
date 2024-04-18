export interface ValueReference {
  /**
   * The schema path of the setting
   */
  scope: string;
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
    | ({
        scopes: string[]; // TODO Adapt the backend accordingly
        id: string;
      } /* TODO Use the same in the ValueReference. We need the same thing for dependencies */ & {
        triggerInitially: undefined;
      });
}
export interface PathAndValue {
  path: string | string[]; // Consider using only string[] here
  id: null;
  value: unknown;
}

export interface IdAndValue {
  path: null;
  id: string;
  value: unknown;
}

export type UpdateResult = PathAndValue | IdAndValue;
