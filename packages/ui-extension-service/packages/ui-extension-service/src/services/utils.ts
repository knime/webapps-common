import { AlertConfig, CreateAlertParams, AlertType } from "@/types/alert";
import { NodeInfo } from "@/types/NodeInfo";

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
