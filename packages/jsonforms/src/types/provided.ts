import type { IdAndText } from "./ChoicesUiSchema";
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

type getData = (
  params: unknown,
) => Promise<{ result: IdAndText[]; state: string; message: string[] }>;

/**
 * Types provided by the JsonFormsDialog.vue component
 */
export interface Provided {
  addStateProviderListener: addStateProviderListener<never>;
  trigger: (triggerId: unknown) => void;
  sendAlert: (params: AlertParams) => void;
  // To be removed (see JsonFormsDialog.vue)
  registerWatcher: registerWatcher;
  getData: getData;
}
