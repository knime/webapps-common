import type { Control } from "./Control";
import type { AlertParams } from "./alert";

type addStateProviderListener<T> = (
  id: unknown,
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

// TODO: replace any
type getData = (params: unknown) => Promise<any>;

/**
 * Types provided by the JsonFormsDialog.vue component
 */
export interface Provided {
  // TODO: replace any
  addStateProviderListener: addStateProviderListener<any>;
  trigger: (triggerId: unknown) => void;
  sendAlert: (params: AlertParams) => void;
  // To be removed (see JsonFormsDialog.vue)
  // TODO: replace any
  getPossibleValuesFromUiSchema: (control: Control) => Promise<any[]>;
  registerWatcher: registerWatcher;
  getData: getData;
}
