/**
 *  @param T the type of the settings (same as in {@link DialogService})
 *
 * E.g. ({@see DefaultSettingComparator }) .
 */
export interface SettingComparator<T> {
  /**
   * @param settings new settings
   * @returns whether the new settings were modified with respect to the scope of this comparator
   * (i.e. wether model or view settings inside of the new settings are modified)
   */
  isModified: (settings: T) => boolean;

  /**
   * @param cleanSettings either initial or applied settings
   */
  setSettings: (cleanSettings: T) => void;
}

/**
 * Default implementation of a {@link SettingComparator} that holds an internal clean state
 *  updated by {@link setCleanSettings} to compare against on {@link isModified}
 *
 * @param T the type of the settings (same as in {@link DialogService})
 * @param S the type of the internally held clean state to compare against
 *
 * The methods {@link toInternalState} and {@link equals} need to be implemented.
 */
export class DefaultSettingComparator<T = any, S = any>
  implements SettingComparator<T>
{
  /**
   * Internal state to compare against
   */
  private cleanState!: S;

  isModified(settings: T) {
    return !this.equals(this.toInternalState(settings), this.cleanState);
  }

  setSettings(cleanSettings: T) {
    this.cleanState = this.toInternalState(cleanSettings);
  }

  /**
   * Transformation applied to settings before they are compared against each other with {@link equals}
   *
   * Implementation required
   */
  // eslint-disable-next-line class-methods-use-this
  toInternalState(_cleanSettings: T): S {
    throw new Error("You have to implement the method setCleanJsonString!");
  }

  /**
   * @param _newState the internal state representation of possibly modified settings
   * @param _cleanState a clean internal state
   * @returns true if the {@link _newState} is clean
   *
   * Implementation required
   */
  // eslint-disable-next-line class-methods-use-this
  equals(_newState: S, _cleanState: S): boolean {
    throw new Error("You have to implement the method equals!");
  }
}
