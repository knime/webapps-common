import type { IdAndText } from "./ChoicesUiSchema";
import type { AlertParams } from "./alert";

export type StateProviderLocation = (
  | {
      id: string;
    }
  | {
      scope: string;
    }
) & {
  providedOptionName: string;
};

type addStateProviderListener<T> = (
  identifier: StateProviderLocation & { [key: string]: unknown },
  callback: (data: T) => void,
) => void;

export type SettingsData = Record<string, object> & {
  view?: object;
  model?: object;
};

type registerWatcher = (params: {
  transformSettings: (
    dependencyData: SettingsData,
  ) => Promise<(newData: SettingsData) => void> | void;
  init?: (newData: SettingsData) => Promise<void>;
  dependencies: string[];
}) => Promise<() => void>;

type getData = (
  params: unknown,
) => Promise<{ result: IdAndText[]; state: string; message: string[] }>;

/**
 * Types provided by the JsonFormsDialog.vue component
 */
export interface Provided {
  addStateProviderListener: addStateProviderListener<unknown>;
  trigger: (triggerId: unknown) => void;
  sendAlert: (params: AlertParams) => void;
  /**
   * Called by elements who have custom validation needs.
   * Calling this method on every value change (debounced) starts when the ui option
   * `validatorId` is provided with a non-`null` value  and stops when `null` is provided
   * as id. Also one call is issued when the `validatorId` is provided.
   *
   * @param id the id of the validator
   * @param data the current data to validate
   */
  validate: (id: string, data: unknown) => Promise<string | null>;
  // To be removed (see JsonFormsDialog.vue)
  registerWatcher: registerWatcher;
  getData: getData;
}
