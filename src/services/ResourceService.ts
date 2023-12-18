import { UIExtensionService } from "src/knime-svc";
import { getBaseService } from "./utils";

export class ResourceService<
  T extends {
    resourceInfo?: {
      baseUrl: string;
    };
  } = any,
> {
  private knimeService: UIExtensionService<T>;

  /**
   * @param { KnimeService } knimeService
   */
  constructor(baseService?: UIExtensionService<T>) {
    this.knimeService = getBaseService(baseService);
  }

  getResourceUrl(path: string) {
    const config = this.knimeService.getConfig();
    return this.knimeService.getResourceLocation(
      config?.resourceInfo?.baseUrl,
      path,
    );
  }
}
