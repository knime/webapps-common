import { type AlertParams, AlertType } from "../types/alert";

import { AbstractService } from "./AbstractService";
import { USER_ERROR_CODE } from "./types/jsonRPCTypes";
import type { AlertingServiceAPILayer } from "./types/serviceApiLayers";

/**
 * A service that can be used to send warnings or errors to the embedder.
 */
export class AlertingService extends AbstractService<AlertingServiceAPILayer> {
  sendAlert(params: AlertParams) {
    if (params.type === AlertType.WARN) {
      this.baseService.sendAlert({
        type: params.type,
        warnings: [
          {
            message: params.message,
            details: params.details,
          },
        ],
      });
    } else {
      this.baseService.sendAlert({
        code: USER_ERROR_CODE,
        type: params.type,
        message: params.message,
        data: {
          details: params.details,
        },
      });
    }
  }
}
