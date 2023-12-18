import { AlertConfig, CreateAlertParams } from "src/types/Alert";
import { AlertTypes, NodeInfo, UIExtensionService } from "..";
import { createUIExtensionServiceProxy } from "src/knime-svc/service-proxy";

export const getBaseService = (baseService?: UIExtensionService) => {
  const { service } = baseService
    ? { service: baseService }
    : createUIExtensionServiceProxy();
  return service;
};

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
