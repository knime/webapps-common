import type { UIExtensionPushEvents } from "@knime/ui-extension-renderer/api";

import { AbstractService } from "./AbstractService";
import type { SharedDataServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A service used to share data between different UI Extensions.
 *
 * Currently, this is enabled for communicating from Dialogs to Views.
 */
export class SharedDataService extends AbstractService<SharedDataServiceAPILayer> {
  /**
   * Publish updated data to the embedder.
   * This may be used on embedder side by sending the data to dependent other UI Extensions.
   * @param {T} data - the updated data.
   * @returns {void}
   */
  shareData(data: any) {
    this.baseService.publishData(data);
  }

  /**
   * Adds callback that will be triggered when data shared by other UI Extensions changes.
   * @param {Function} callback - called on shared data change.
   * @returns {() => void} - method for removing the listener again
   */
  addSharedDataListener(callback: (data: any) => void) {
    return this.baseService.addPushEventListener(
      "DataEvent" satisfies UIExtensionPushEvents.KnownEventType,
      callback,
    );
  }

  /**
   * Similarly to {@link addSharedDataListener} this method can be used to receive the current data shared
   * by other UIExtensions: It returns the current state of shared data at the moment
   * the present one is initiated.
   *
   * If no such date have been shared, null is returned.
   */
  getInitialSharedData(): any {
    return this.baseService.getConfig().initialSharedData ?? null;
  }
}
