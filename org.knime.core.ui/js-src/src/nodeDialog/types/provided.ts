import type {
  JsonDataService,
  KnimeService,
} from "@knime/ui-extension-service";
import type { PossibleFlowVariable } from "../api/types";
import type { getPossibleValuesFromUiSchema } from "../utils";
import type Control from "./Control";
import type SettingsData from "./SettingsData";

type getPossibleValuesFromUiSchema = (
  control: Control,
) => ReturnType<typeof getPossibleValuesFromUiSchema>;

type registerWatcher = (params: {
  transformSettings: (newData: SettingsData) => Promise<void>;
  init: (newData: SettingsData) => Promise<void>;
  dependencies: string[];
}) => void;
type getData = (
  params: Parameters<JsonDataService["data"]>[0] & object,
) => Promise<any>;
type sendAlert = (params: Parameters<KnimeService["createAlert"]>[0]) => void;

type ProvidedFlowVariablesApi = {
  getAvailableFlowVariables: (
    persistPath: string,
  ) => Promise<Record<string, PossibleFlowVariable[]>>;
  getFlowVariableOverrideValue: (dataPath: string) => Promise<any>;
};

type Provided = {
  getPossibleValuesFromUiSchema: getPossibleValuesFromUiSchema;
  registerWatcher: registerWatcher;
  updateData: any;
  getData: getData;
  sendAlert: sendAlert;
  flowVariablesApi: ProvidedFlowVariablesApi;
};

export default Provided;
