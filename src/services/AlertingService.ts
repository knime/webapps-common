import { createAlert } from "./utils";
import { CreateAlertParams } from "src/types/alert";
import { AbstractService } from "./AbstractService";
import { AlertingServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class AlertingService extends AbstractService<AlertingServiceAPILayer> {
  sendAlert(params: CreateAlertParams, isDialog = false) {
    const alert = createAlert(this.baseService.getConfig(), params);
    if (isDialog) {
      /** In order to circumvent the Node: MISSING header in the AlertGlobal
       * component in the pagebuilder
       */
      alert.nodeInfo.nodeName = " ";
    }
    this.baseService.sendAlert(alert);
  }
}
