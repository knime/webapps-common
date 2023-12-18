import { UIExtensionService } from "src/knime-svc/types";
import { createAlert, getBaseService } from "./utils";
import { AlertConfig, CreateAlertParams } from "src/types/Alert";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class AlertingService<T extends AlertConfig = any> {
  private baseService: UIExtensionService<T>;

  constructor(baseService?: UIExtensionService<T>) {
    this.baseService = getBaseService(baseService);
  }

  sendAlert(params: CreateAlertParams) {
    this.baseService.sendAlert(
      createAlert(this.baseService.getConfig(), params),
    );
  }
}
