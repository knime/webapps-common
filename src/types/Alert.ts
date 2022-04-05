import { AlertTypes } from './AlertTypes';
import { NodeInfo } from './NodeInfo';

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
    nodeInfo: NodeInfo;
    type: AlertTypes | keyof typeof AlertTypes;
    code?: string | number;
    subtitle?: string;
    message?: string;
};
