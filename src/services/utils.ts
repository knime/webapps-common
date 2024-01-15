import { AlertConfig, CreateAlertParams } from "src/types/Alert";
import { AlertTypes, NodeInfo } from "src/types";

export const createAlert = (
  baseConfig: AlertConfig,
  alertParams: CreateAlertParams,
) => {
  const { type = AlertTypes.ERROR, message, code, subtitle } = alertParams;
  return {
    nodeId: baseConfig.nodeId ?? "MISSING",
    nodeInfo: baseConfig.nodeInfo ?? ({} as NodeInfo),
    type,
    message,
    code,
    subtitle,
  };
};
