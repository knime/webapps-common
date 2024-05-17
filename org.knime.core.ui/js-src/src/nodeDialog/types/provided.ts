import type {
  JsonDataService,
  CreateAlertParams,
} from "@knime/ui-extension-service";
import type { FlowSettings, PossibleFlowVariable } from "../api/types";
import type { getPossibleValuesFromUiSchema } from "../utils";
import type Control from "./Control";
import type SettingsData from "./SettingsData";
import { IdsRecord } from "../composables/nodeDialog/useArrayIds";

type getPossibleValuesFromUiSchema = (
  control: Control,
) => ReturnType<typeof getPossibleValuesFromUiSchema>;

type registerWatcher = (params: {
  transformSettings: (
    dependencyData: SettingsData,
  ) => Promise<(newData: SettingsData) => void> | void;
  init?: (newData: SettingsData) => Promise<void>;
  dependencies: string[];
}) => Promise<() => void>;

type addStateProviderListener<T> = (
  identity: { id: string; indexIds?: string[] },
  callback: (data: T) => void,
) => void;

type getData = (
  params: Parameters<JsonDataService["data"]>[0] & object,
) => Promise<any>;
type sendAlert = (params: CreateAlertParams) => void;

interface Provided {
  getPossibleValuesFromUiSchema: getPossibleValuesFromUiSchema;
  addStateProviderListener: addStateProviderListener<any>;
  registerWatcher: registerWatcher;
  trigger: (triggerId: { id: string; indexIds?: string[] }) => void;
  updateData: (path: string) => void;
  sendAlert: sendAlert;
  getData: getData;
  setSubPanelExpanded: (param: { isExpanded: boolean }) => void;
  getPanelsContainer: () => null | HTMLElement;
  createArrayAtPath: (path: string) => IdsRecord;
  getDialogPopoverTeleportDest: () => null | HTMLElement;
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
