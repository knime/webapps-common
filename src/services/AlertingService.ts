import { UIExtensionAPILayer } from "src/serviceTypes";
import { createAlert } from "./utils";
import { AlertConfig, CreateAlertParams } from "src/types/Alert";
import { AbstractService } from "./AbstractService";

type AlertingServiceAPILayer = Pick<UIExtensionAPILayer, "sendAlert"> & {
  getConfig: () => AlertConfig;
};

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class AlertingService extends AbstractService<AlertingServiceAPILayer> {
  sendAlert(params: CreateAlertParams) {
    this.baseService.sendAlert(
      createAlert(this.baseService.getConfig(), params),
    );
  }
}
