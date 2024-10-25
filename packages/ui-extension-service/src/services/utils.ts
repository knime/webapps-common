import type { NodeInfo } from "../types/NodeInfo";
import {
  type AlertConfig,
  AlertType,
  type CreateAlertParams,
} from "../types/alert";

export const createAlert = (
  baseConfig: AlertConfig,
  alertParams: CreateAlertParams,
) => {
  const { type = AlertType.ERROR, message, code, subtitle } = alertParams;
  return {
    nodeId: baseConfig.nodeId ?? "MISSING",
    nodeInfo: baseConfig.nodeInfo ?? ({} as NodeInfo),
    type,
    message,
    code,
    subtitle,
  };
};
