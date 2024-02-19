import { UIExtensionPushEvents } from "src/types";
import { AbstractService } from "./AbstractService";
import { DialogServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class DialogService extends AbstractService<DialogServiceAPILayer> {
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
   * Whether the method {@link setCleanModelSettings} has beed called since the
   * method {@link setDirtyModelSettings} has last been called
   */
  private dirtyModelSettings = false;

  /**
   * To be called whenever settings change and the model settings are clean afterwards (possibly also before)
   * @param {any} data - the current data without dirty model settings
   */
  setSettingsWithCleanModelSettings(data: any) {
    this.dirtyModelSettings = false;
    this.baseService.setSettingsWithCleanModelSettings(data);
  }

  /**
   * To be called when the last applied model settings do not match the current ones
   */
  setDirtyModelSettings() {
    this.dirtyModelSettings = true;
    this.baseService.setDirtyModelSettings();
  }

  /**
   * Publish a data update event to the embedder to be sent to other UIExtensions.
   * @param {any} data - the data to send.
   * @returns {void}
   */
  publishSettings(data: any) {
    if (!this.dirtyModelSettings) {
      this.baseService.publishData(data);
    }
  }

  /**
   * This should be used to listen to push events of the embedder to apply the settings in the dialog.
   */
  setApplyListener(applyListener: () => Promise<{ isApplied: boolean }>) {
    return this.baseService.addPushEventListener(
      UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      () => {
        applyListener().then(
          ({ isApplied }) => isApplied && this.baseService.onApplied(),
        );
      },
    );
  }
}
