import { UIExtensionAPILayer } from "src/serviceTypes";
import { AbstractService } from "./AbstractService";

type ResourceServiceExtensionConfig = {
  resourceInfo?: {
    baseUrl: string;
  };
};
type ResourceServiceAPILayer = Pick<
  UIExtensionAPILayer,
  "getResourceLocation"
> & { getConfig: () => ResourceServiceExtensionConfig };

export class ResourceService extends AbstractService<ResourceServiceAPILayer> {
  getResourceUrl(path: string) {
    const config = this.baseService.getConfig();
    return this.baseService.getResourceLocation(
      config?.resourceInfo?.baseUrl,
      path,
    );
  }
}
