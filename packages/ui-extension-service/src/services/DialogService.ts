import { UIExtensionPushEvents, type UIExtensionService } from "../types";

import { AbstractService } from "./AbstractService";
import { createDialogDirtyStateHandler } from "./dialogDirtyState";
import type { DialogServiceAPILayer } from "./types/serviceApiLayers";

export interface DisplayModeEventPayload {
  mode: "small" | "large";
}

export interface DisplayModeEventCallbackParams
  extends Pick<DisplayModeEventPayload, "mode"> {}

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class DialogService extends AbstractService<DialogServiceAPILayer> {
  private removeCallbacksMap: Map<Function, () => void>;

  constructor(baseService: UIExtensionService<DialogServiceAPILayer>) {
    super(baseService);
    this.removeCallbacksMap = new Map();
  }

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

  /**
   * Adds callback that will be triggered when the display mode of the dialog changes.
   */
  addOnDisplayModeChangeCallback(
    callback: (event: DisplayModeEventCallbackParams) => void,
  ): void {
    const removeCallback = this.baseService.addPushEventListener(
      UIExtensionPushEvents.EventTypes.DisplayModeEvent,
      // @ts-ignore
      callback,
    );

    this.removeCallbacksMap.set(callback, removeCallback);
  }

  getInitialDisplayMode(): "small" | "large" {
    return this.baseService.getConfig().startEnlarged ? "large" : "small";
  }

  /**
   * Removes previously added callback.
   * @param {function} callback - that needs to be removed from events.
   * @returns {void}
   */
  removeOnDisplayModeChangeCallback(
    callback: (event: DisplayModeEventCallbackParams) => void,
  ): void {
    this.removeCallbacksMap.get(callback)?.();
    this.removeCallbacksMap.delete(callback);
  }
}
