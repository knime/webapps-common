import { AbstractService } from "./AbstractService";
import { CloseServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A service which which a UIExtension can close itself
 */
export class CloseService extends AbstractService<CloseServiceAPILayer> {
  close(isMetaKeyPressed: boolean = false) {
    this.baseService.close(isMetaKeyPressed);
  }
}
