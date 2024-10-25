import type { NodeInfo } from "./NodeInfo";

/**
 * @enum
 */
export enum AlertType {
  ERROR = "error",
  WARN = "warn",
}

/**
 *
 * @property {string} nodeId - the id of the node in the workflow.
 * @property {NodeInfo} nodeInfo - additional information regarding the node itself.
 * @property {AlertTypes} type - the type of the alert (@see AlertTypes).
 * @property {string | number} [code] - an optional error/status code.
 * @property {string} [subtitle] - an optional subtitle for the alert.
 * @property {string} [message] - an optional message body for the alert.
 */
export type Alert = {
  nodeId: string;
  nodeInfo?: NodeInfo;
  type: AlertType;
  code?: string | number;
  subtitle?: string;
  message?: string;
};

export type AlertConfig = {
  nodeId?: string;
  nodeInfo?: NodeInfo;
};

export type CreateAlertParams = {
  type?: AlertType;
  message?: string;
  code?: string | number;
  subtitle?: string;
};
