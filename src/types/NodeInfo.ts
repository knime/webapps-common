/**
 * @property {string} [nodeAnnotation] - the optional annotation associated with the node.
 * @property {string} nodeState - the current state of the node.
 * @property {string} [nodeErrorMessage] - the optional error message associated with a node in the failed state.
 * @property {string} [nodeWarnMessage] - the optional warning message associated with a node in the failed state.
 * @property {string} nodeName - the human-readable node name as it's registered with the node description.
 */
export type NodeInfo = {
    nodeAnnotation?: string;
    nodeState: string;
    nodeErrorMessage?: string;
    nodeWarnMessage?: string;
    nodeName: string;
};
