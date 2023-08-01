import { SelectionModes } from "./SelectionModes";

export type Event = {
  payload?: {
    projectId: string;
    workflowId: string;
    nodeId: string;
    mode: SelectionModes | string;
    selection?: string[];
  };
  type?: "ERROR" | "WARNING" | string;
  nodeInfo?: {
    nodeName: string;
    nodeAnnotation: string;
  };
  eventType?: string;
  [key: string]: any;
};
