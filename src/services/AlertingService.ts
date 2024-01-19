import { createAlert } from "./utils";
import { CreateAlertParams } from "src/types/alert";
import { AbstractService } from "./AbstractService";
import { AlertingServiceAPILayer } from "./types/serviceApiLayers";

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
