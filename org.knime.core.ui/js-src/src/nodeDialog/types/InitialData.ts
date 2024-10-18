import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { FlowSettings } from "../api/types";
import SettingsData from "./SettingsData";
import { Update, UpdateResult } from "./Update";
import { PersistSchema } from "./Persist";

export interface InitialData {
  data: SettingsData;
  schema: JsonSchema;
  ui_schema: UISchemaElement;
  flowVariableSettings: Record<string, FlowSettings>;
  /**
   * Data defining the value updates from dependencies to targets
   */
  globalUpdates?: Update[];
  /**
   * Data defining values that have been computed while opening the dialog
   */
  initialUpdates?: UpdateResult[];
  /**
   * Information on the persist structure used to map flow variables to controls.
   */
  persist: PersistSchema;
}
