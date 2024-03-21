import { UIExtensionPushEvents } from "src/types";
import { AbstractService } from "./AbstractService";
import { DialogServiceAPILayer } from "./types/serviceApiLayers";
import { createDialogDirtyStateHandler } from "./dialogDirtyState";

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
   * Publish updated settings to the embedder.
   * This may be used on embedder side by sending the settings to dependent other UI Extensions.
   * @param {T} settings - the updated settings.
   * @returns {void}
   */
  publishSettings(settings: T) {
    this.baseService.publishData(settings);
  }

  private dirtyStateHandler = createDialogDirtyStateHandler(
    this.baseService.onDirtyStateChange,
  );

  /**
   * Call this method in order to track modifications in settings and expose specific dirty states relevant for the embedder.
   * E.g. for a view setting which is exposed as a variable if the value of the setting is modified, the node is to be reset
   * on apply which is relevant information for the embedder.
   */
  registerSettings(modelOrView: "model" | "view") {
    return this.dirtyStateHandler.addSetting(modelOrView);
  }

  /**
   * This needs to be called in order to enable listening to push events of the embedder to apply the settings in the dialog.
   */
  setApplyListener(applyListener: () => Promise<{ isApplied: boolean }>) {
    return this.baseService.addPushEventListener(
      UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      () => {
        applyListener().then(({ isApplied }) => {
          if (isApplied) {
            this.dirtyStateHandler.onApply();
          }
          this.baseService.onApplied({ isApplied });
        });
      },
    );
  }

  setControlsVisibility(param: { shouldBeVisible: boolean }) {
    this.baseService.setControlsVisibility(param);
  }
}
