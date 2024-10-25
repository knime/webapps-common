import type { DataValueViewConfig } from "..";

import { AbstractService } from "./AbstractService";
import type { DataValueViewAPILayer } from "./types/serviceApiLayers";

export class DataValueViewService extends AbstractService<DataValueViewAPILayer> {
  showDataValueView(config: DataValueViewConfig) {
    this.baseService.showDataValueView(config);
  }

  closeDataValueView() {
    this.baseService.closeDataValueView();
  }
}
