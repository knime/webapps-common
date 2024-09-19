import { DataValueViewConfig } from "..";
import { AbstractService } from "./AbstractService";
import { DataValueViewAPILayer } from "./types/serviceApiLayers";

export class DataValueViewService extends AbstractService<DataValueViewAPILayer> {
  showDataValueView(config: DataValueViewConfig) {
    this.baseService.showDataValueView(config);
  }

  closeDataValueView() {
    this.baseService.closeDataValueView();
  }
}
