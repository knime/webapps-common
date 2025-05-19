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

type getData = (params: any) => Promise<any>;

/**
 * Types provided by the JsonFormsDialog.vue component
 */
export interface Provided {
  addStateProviderListener: addStateProviderListener<any>;
  trigger: (triggerId: any) => void;
  sendAlert: (params: AlertParams) => void;
  // To be removed (see JsonFormsDialog.vue)
  registerWatcher: registerWatcher;
  getData: getData;
}
