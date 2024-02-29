import { UIExtensionPushEvents } from "src/types";
import { AbstractService } from "./AbstractService";
import { DialogServiceAPILayer } from "./types/serviceApiLayers";
import { SettingsComparator } from "./SettingsComparator";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 * @param T the type of the settings
 */
export class DialogService<
  T = any,
> extends AbstractService<DialogServiceAPILayer> {
  /**
   * @returns {boolean} - true, if the node this dialog belongs to also has a node view, otherwise false
   */
  hasNodeView() {
    return this.baseService.getConfig().hasNodeView;
  }

  /**
   * @returns {boolean} - true, if the dialog settings can't be saved (e.g. meaning that the OK-button is disabled);
   *         otherwise false
   */
  isWriteProtected() {
    return this.baseService.getConfig().writeProtected;
  }

  /**
   * This method is to be called once initially, to set up handlers used when settings are applied or modified
   */
  configureSettingsLifecycle({
    applyListener,
    modifyConfig,
  }: {
    /**
     * Used to listen to push events of the embedder to apply the settings in the dialog.
     */
    applyListener: () => Promise<
      | { isApplied: true; appliedSettings: T }
      | { isApplied: false; appliedSettings?: T }
    >;
    /**
     * Defines whether model and/or view settings are communicated as modified to the embedder
     * with every call to {@link publishSettings}.
     */
    modifyConfig: {
      /**
       * Settings that serve as a clean starting point
       */
      initialSettings: T;
      /**
       * To be supplied if model settings exist in the dialog.
       * For a simple implementation to extend from { @see DefaultSettingsComparator }.
       */
      modelSettingsComparator?: SettingsComparator<T>;
      /**
       * To be supplied if view settings exist in the dialog.
       * For a simple implementation to extend from { @see DefaultSettingsComparator }.
       */
      viewSettingsComparator?: SettingsComparator<T>;
    };
  }) {
    this.setApplyListener(applyListener);
    this.setModifyConfig(modifyConfig);
  }

  /**
   * Publish updated settings to the embedder.
   * This may be used on embedder side by sending the settings to dependent other UI Extensions.
   * @param {T} settings - the updated settings.
   * @returns {void}
   */
  publishSettings(settings: T) {
    this.baseService.publishSettings({
      settings,
      settingsModified: {
        model: this.modelSettingsComparator?.isModified(settings) ?? true,
        view: this.viewSettingsComparator?.isModified(settings) ?? true,
      },
    });
  }

  private modelSettingsComparator: SettingsComparator<unknown>;
  private viewSettingsComparator: SettingsComparator<unknown>;

  setModifyConfig({
    modelSettingsComparator,
    viewSettingsComparator,
    initialSettings,
  }: {
    modelSettingsComparator?: SettingsComparator<T>;
    viewSettingsComparator?: SettingsComparator<T>;
    initialSettings: T;
  }) {
    this.modelSettingsComparator = modelSettingsComparator;
    this.viewSettingsComparator = viewSettingsComparator;
    this.setCleanSettings(initialSettings);
  }

  private setApplyListener(
    applyListener: () => Promise<
      | { isApplied: true; appliedSettings: T }
      | { isApplied: false; appliedSettings?: T }
    >,
  ) {
    return this.baseService.addPushEventListener(
      UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      () => {
        applyListener().then(({ isApplied, appliedSettings }) => {
          if (isApplied) {
            this.setCleanSettings(appliedSettings);
            this.publishSettings(appliedSettings);
          }
          this.baseService.onApplied({ isApplied });
        });
      },
    );
  }

  private setCleanSettings(cleanSettings: T) {
    this.modelSettingsComparator?.setSettings(cleanSettings);
    this.viewSettingsComparator?.setSettings(cleanSettings);
  }
}
