import { AbstractService } from "./AbstractService";
import { ResourceServiceAPILayer } from "./types/serviceApiLayers";

export class ResourceService extends AbstractService<ResourceServiceAPILayer> {
  getResourceUrl(path: string) {
    return this.baseService.getResourceLocation(path);
  }
}
