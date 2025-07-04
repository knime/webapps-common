import type {
  DataValueViewConfig,
  KnownEventType,
} from "@knime/ui-extension-renderer/api";

import { AbstractService } from "./AbstractService";
import type { DataValueViewAPILayer } from "./types/serviceApiLayers";

export class DataValueViewService extends AbstractService<DataValueViewAPILayer> {
  showDataValueView(config: DataValueViewConfig) {
    this.baseService.showDataValueView(config);
  }

  closeDataValueView() {
    this.baseService.closeDataValueView();
  }

  /**
   * This needs to be called in order to enable listening to push events of the
   * embedder informing the extension whether the data value views are open or closed.
   */
  setDataValueViewStateListener(listener: (isOpen: boolean) => void) {
    this.baseService.addPushEventListener(
      "DataValueViewShownEvent" satisfies KnownEventType,
      (isOpen) => listener(isOpen ?? false),
    );
  }
}
