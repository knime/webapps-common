/* eslint-disable class-methods-use-this */
import { DefaultSettingComparator } from "@knime/ui-extension-service";

export type Stringifyable =
  | object
  | undefined
  | null
  | string
  | number
  | boolean;

export class JsonSettingsComparator extends DefaultSettingComparator<
  Stringifyable,
  string
> {
  toInternalState(cleanSettings: object | undefined): string {
    return JSON.stringify(cleanSettings);
  }

  equals(newState: string, cleanState: string): boolean {
    return newState === cleanState;
  }
}
