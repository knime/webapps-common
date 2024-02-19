import type {
  JsonDataService,
  AlertingService,
} from "@knime/ui-extension-service";
import type { FlowSettings, PossibleFlowVariable } from "../api/types";
import type { getPossibleValuesFromUiSchema } from "../utils";
import type Control from "./Control";
import type SettingsData from "./SettingsData";

type getPossibleValuesFromUiSchema = (
  control: Control,
) => ReturnType<typeof getPossibleValuesFromUiSchema>;

type registerWatcher = (params: {
  transformSettings: (newData: SettingsData) => Promise<void> | void;
  init?: (newData: SettingsData) => Promise<void>;
  dependencies: string[];
}) => Promise<() => void>;

type addStateProviderListener<T> = (
  id: string,
  callback: (data: T) => void,
) => void;

type getData = (
  params: Parameters<JsonDataService["data"]>[0] & object,
) => Promise<any>;
type sendAlert = (params: Parameters<AlertingService["sendAlert"]>[0]) => void;

interface Provided {
  getPossibleValuesFromUiSchema: getPossibleValuesFromUiSchema;
  addStateProviderListener: addStateProviderListener<any>;
  registerWatcher: registerWatcher;
  trigger: (triggerId: string) => void;
  updateData: any;
  sendAlert: sendAlert;
  getData: getData;
  setDirtyModelSettings: () => void;
}

type ProvidedFlowVariablesApi = {
  getAvailableFlowVariables: (
    persistPath: string,
  ) => Promise<Record<string, PossibleFlowVariable[]>>;
  getFlowVariableOverrideValue: (
    persistPath: string,
    dataPath: string,
  ) => Promise<any>;
  clearControllingFlowVariable: (persistPath: string) => void;
};

export default Provided;

interface ProvidedForFlowVariables {
  getFlowVariablesMap: () => Record<string, FlowSettings>;
  flowVariablesApi: ProvidedFlowVariablesApi;
}

export { ProvidedForFlowVariables };
