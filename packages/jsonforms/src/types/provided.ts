import type { Control } from "./Control";
import type { AlertParams } from "./alert";

type addStateProviderListener<T> = (
  id: any,
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

type getData = (params: any) => Promise<any>;

/**
 * Types provided by the JsonFormsDialog.vue component
 */
export interface Provided {
  addStateProviderListener: addStateProviderListener<any>;
  trigger: (triggerId: any) => void;
  sendAlert: (params: AlertParams) => void;
  // To be removed (see JsonFormsDialog.vue)
  getPossibleValuesFromUiSchema: (control: Control) => Promise<any[]>;
  registerWatcher: registerWatcher;
  getData: getData;
}
