import type { AlertType } from "@knime/ui-extension-renderer/api";

import { AbstractService } from "./AbstractService";
import { USER_ERROR_CODE, type UserErrorCode } from "./types/jsonRPCTypes";
import type { AlertingServiceAPILayer } from "./types/serviceApiLayers";

export type { AlertType };

export type AlertParams = {
  type: AlertType;
  /**
   * Message that should become visible to the user.
   */
  message: string;
  /**
   * Additional details about the problem that are displayed on demand.
   */
  details?: string;
  /**
   * Error code to e.g. distinguish between default errors presented via
   * toasts and blocking errors showing an error view.
   */
  code?: UserErrorCode;
};

/**
 * A service that can be used to send warnings or errors to the embedder.
 */
export class AlertingService extends AbstractService<AlertingServiceAPILayer> {
  sendAlert(params: AlertParams) {
    if (params.type === "warn") {
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
        code: params.code || USER_ERROR_CODE,
        type: params.type,
        message: params.message,
        data: {
          details: params.details,
        },
      });
    }
  }
}
