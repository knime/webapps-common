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
  scope: undefined;
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
  trigger: Trigger | (ValueReference & { triggerInitially: undefined });
}
export interface PathAndValue {
  path: string;
  id: null;
  value: unknown;
}

export interface IdAndValue {
  path: null;
  id: string;
  value: unknown;
}

export type UpdateResult = PathAndValue | IdAndValue;
