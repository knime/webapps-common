import type { JsonSchema, UISchemaElement } from "@jsonforms/core";
import type { FlowSettings } from "../api/types";
import type { SettingsData } from "./SettingsData";
import type { Update, UpdateResult } from "./Update";
import type { PersistSchema } from "./Persist";

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
